use sha2::{Sha256, Digest};
use std::collections::HashMap;

// Mock storage layer (in production, this would use WeilChain's state API)
static mut STORAGE: Option<HashMap<Vec<u8>, Vec<u8>>> = None;

fn get_storage() -> &'static mut HashMap<Vec<u8>, Vec<u8>> {
    unsafe {
        if STORAGE.is_none() {
            STORAGE = Some(HashMap::new());
        }
        STORAGE.as_mut().unwrap()
    }
}

/// HTLC (Hashed Time-Locked Contract) structure
#[derive(Debug)]
struct HTLC {
    sender: Vec<u8>,
    receiver: Vec<u8>,
    amount: u64,
    hash_lock: [u8; 32],
    timeout: u64,
    claimed: bool,
}

/// Main service invocation entry point
/// 
/// This function is called when an applet is invoked from the frontend.
/// The data parameter contains the serialized request.
#[no_mangle]
pub extern "C" fn invoke_service(data: *const u8, len: usize) -> i32 {
    // Safety: Convert raw pointer to slice
    let input_data = unsafe {
        std::slice::from_raw_parts(data, len)
    };
    
    // Parse input (in production, use proper serialization)
    let input_str = std::str::from_utf8(input_data).unwrap_or("");
    
    // Store invocation record
    let key = b"last_invocation";
    get_storage().insert(key.to_vec(), input_data.to_vec());
    
    // Return success code
    0
}

/// Lock funds in an HTLC contract
/// 
/// This enables atomic swaps across different pods in the WeilChain network.
/// 
/// # Arguments
/// * `hash_lock` - SHA256 hash of the secret preimage
/// * `timeout` - Block height at which the lock expires
/// * `receiver` - Address of the intended recipient
/// * `amount` - Amount of WEIL tokens to lock
#[no_mangle]
pub extern "C" fn lock_funds(
    hash_lock_ptr: *const u8,
    timeout: u64,
    receiver_ptr: *const u8,
    receiver_len: usize,
    amount: u64,
) -> i32 {
    // Parse hash_lock (32 bytes)
    let hash_lock: [u8; 32] = unsafe {
        let slice = std::slice::from_raw_parts(hash_lock_ptr, 32);
        slice.try_into().unwrap()
    };
    
    // Parse receiver address
    let receiver = unsafe {
        std::slice::from_raw_parts(receiver_ptr, receiver_len).to_vec()
    };
    
    // Create HTLC
    let htlc = HTLC {
        sender: b"sender_address".to_vec(), // In production, get from context
        receiver,
        amount,
        hash_lock,
        timeout,
        claimed: false,
    };
    
    // Store HTLC (serialize to bytes)
    let htlc_key = format!("htlc_{}", hex::encode(&hash_lock));
    // In production, properly serialize the HTLC struct
    get_storage().insert(htlc_key.into_bytes(), vec![1]);
    
    // Emit event (in production, use WeilChain event system)
    log_event("FundsLocked", &format!("amount={},timeout={}", amount, timeout));
    
    0 // Success
}

/// Claim funds from an HTLC by providing the preimage
/// 
/// # Arguments
/// * `preimage` - The secret that hashes to the hash_lock
#[no_mangle]
pub extern "C" fn claim_funds(preimage_ptr: *const u8, preimage_len: usize) -> i32 {
    // Parse preimage
    let preimage = unsafe {
        std::slice::from_raw_parts(preimage_ptr, preimage_len)
    };
    
    // Hash the preimage
    let mut hasher = Sha256::new();
    hasher.update(preimage);
    let hash_result = hasher.finalize();
    let hash_lock: [u8; 32] = hash_result.into();
    
    // Look up HTLC
    let htlc_key = format!("htlc_{}", hex::encode(&hash_lock));
    
    if get_storage().contains_key(htlc_key.as_bytes()) {
        // In production:
        // 1. Verify timeout hasn't expired
        // 2. Verify HTLC hasn't been claimed
        // 3. Transfer funds to receiver
        // 4. Mark HTLC as claimed
        
        // Remove HTLC from storage
        get_storage().remove(htlc_key.as_bytes());
        
        log_event("FundsClaimed", &format!("hash={}", hex::encode(&hash_lock)));
        
        0 // Success
    } else {
        -1 // HTLC not found
    }
}

/// Claim a reward (example function)
#[no_mangle]
pub extern "C" fn claim_reward(user_ptr: *const u8, user_len: usize) -> i32 {
    let user = unsafe {
        std::slice::from_raw_parts(user_ptr, user_len)
    };
    
    let user_str = std::str::from_utf8(user).unwrap_or("unknown");
    
    // Check eligibility
    let rewards_key = format!("rewards_{}", user_str);
    
    if get_storage().contains_key(rewards_key.as_bytes()) {
        // Distribute reward
        log_event("RewardClaimed", user_str);
        get_storage().remove(rewards_key.as_bytes());
        0
    } else {
        -2 // No rewards available
    }
}

/// Get stored value (query function)
#[no_mangle]
pub extern "C" fn get_value(key_ptr: *const u8, key_len: usize) -> i32 {
    let key = unsafe {
        std::slice::from_raw_parts(key_ptr, key_len)
    };
    
    if let Some(value) = get_storage().get(key) {
        // In production, return the actual value
        // For now, return length as success indicator
        value.len() as i32
    } else {
        -1 // Key not found
    }
}

/// Set stored value (mutation function)
#[no_mangle]
pub extern "C" fn set_value(
    key_ptr: *const u8,
    key_len: usize,
    value_ptr: *const u8,
    value_len: usize,
) -> i32 {
    let key = unsafe {
        std::slice::from_raw_parts(key_ptr, key_len).to_vec()
    };
    
    let value = unsafe {
        std::slice::from_raw_parts(value_ptr, value_len).to_vec()
    };
    
    get_storage().insert(key, value);
    
    0 // Success
}

/// Helper function to log events
/// In production, this would use WeilChain's event emission API
fn log_event(event_type: &str, data: &str) {
    // Mock implementation - in production, emit to blockchain
    let log_message = format!("[EVENT] {}: {}", event_type, data);
    // In WASM environment, this would call the host function
    let _ = log_message; // Suppress unused warning
}

/// Panic handler for WASM
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_htlc_flow() {
        let preimage = b"secret123";
        let mut hasher = Sha256::new();
        hasher.update(preimage);
        let hash_lock: [u8; 32] = hasher.finalize().into();
        
        // Lock funds
        let result = lock_funds(
            hash_lock.as_ptr(),
            1000,
            b"receiver_address".as_ptr(),
            16,
            100,
        );
        assert_eq!(result, 0);
        
        // Claim funds with correct preimage
        let claim_result = claim_funds(preimage.as_ptr(), preimage.len());
        assert_eq!(claim_result, 0);
    }
}
