const API_BASE_URL = '/api';

export const getHeaders = () => {
    const walletAddress = localStorage.getItem('walletAddress');
    return {
        'Content-Type': 'application/json',
        ...(walletAddress ? { 'x-wallet-address': walletAddress } : {}),
    };
};

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },

    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },

    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },

    delete: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },
};

export const endpoints = {
    auth: {
        login: (walletAddress: string) => api.post('/auth/login', { walletAddress }),
    },
    applets: {
        list: () => api.get('/applets'),
        get: (id: string) => api.get(`/applets/${id}`),
    },
    executions: {
        list: () => api.get('/executions'),
        create: (appletId: string, walletAddress: string) =>
            api.post('/executions', { appletId, walletAddress }),
        clear: () => api.delete('/executions'),
    },
    settings: {
        get: () => api.get('/settings'),
        save: (settings: any) => api.put('/settings', settings),
    },
};
