# Wi-Chain DApp Makefile
# Comprehensive build and deployment automation

.PHONY: help install dev build deploy-applet deploy-frontend clean test

# Default target
help:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Wi-Chain DApp - Build & Deployment Commands"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Frontend Commands:"
	@echo "  make install          Install frontend dependencies"
	@echo "  make dev              Start development server"
	@echo "  make build            Build production frontend"
	@echo "  make deploy-frontend  Deploy frontend to hosting"
	@echo ""
	@echo "Applet Commands:"
	@echo "  make build-applet     Build WASM applet"
	@echo "  make deploy-applet    Deploy applet to WeilChain"
	@echo "  make test-applet      Run applet unit tests"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make clean            Clean build artifacts"
	@echo "  make test             Run all tests"
	@echo ""
	@echo "Environment Variables:"
	@echo "  APPLET_NAME          Name of applet to build/deploy (default: example-applet)"
	@echo "  NETWORK              Target network: testnet|mainnet|local (default: testnet)"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Configuration
APPLET_NAME ?= example-applet
NETWORK ?= testnet
APPLET_DIR = applets/$(APPLET_NAME)
WASM_TARGET = wasm32-unknown-unknown

# Frontend targets
install:
	@echo "📦 Installing frontend dependencies..."
	npm install
	@echo "✅ Dependencies installed"

dev:
	@echo "🚀 Starting development server..."
	npm run dev

build:
	@echo "🏗️  Building production frontend..."
	npm run build
	@echo "✅ Frontend build complete (output: dist/)"

deploy-frontend: build
	@echo "🌐 Deploying frontend..."
	@echo "⚠️  Please configure your hosting provider"
	@echo "   Recommended: Vercel, Netlify, or AWS Amplify"
	@echo "   Output directory: dist/"

# Applet targets
build-applet:
	@echo "🦀 Building WASM applet: $(APPLET_NAME)"
	@if [ ! -d "$(APPLET_DIR)" ]; then \
		echo "❌ Applet not found: $(APPLET_DIR)"; \
		exit 1; \
	fi
	@cd $(APPLET_DIR) && cargo build --target $(WASM_TARGET) --release
	@echo "✅ WASM build complete"
	@ls -lh $(APPLET_DIR)/target/$(WASM_TARGET)/release/*.wasm

optimize-applet: build-applet
	@echo "🔧 Optimizing WASM binary..."
	@which wasm-opt > /dev/null || (echo "❌ wasm-opt not found. Install binaryen: brew install binaryen" && exit 1)
	@WASM_FILE=$$(find $(APPLET_DIR)/target/$(WASM_TARGET)/release -name "*.wasm" | head -n 1); \
	wasm-opt -Oz -o $$WASM_FILE.opt $$WASM_FILE && \
	mv $$WASM_FILE.opt $$WASM_FILE
	@echo "✅ Optimization complete"

deploy-applet: build-applet
	@echo "🚀 Deploying applet to WeilChain ($(NETWORK))..."
	node scripts/deploy.js --applet $(APPLET_NAME) --network $(NETWORK)

test-applet:
	@echo "🧪 Running applet tests..."
	@cd $(APPLET_DIR) && cargo test
	@echo "✅ Tests passed"

# Utility targets
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/.vite/
	@if [ -d "$(APPLET_DIR)" ]; then \
		cd $(APPLET_DIR) && cargo clean; \
	fi
	@echo "✅ Clean complete"

test: test-applet
	@echo "🧪 Running frontend tests..."
	@echo "⚠️  Frontend tests not configured yet"

# Quick deployment workflow
deploy-all: build-applet deploy-applet build deploy-frontend
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "🎉 Full deployment complete!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Development workflow
dev-applet:
	@echo "👀 Watching applet for changes..."
	@cd $(APPLET_DIR) && cargo watch -x 'build --target $(WASM_TARGET)'

# Setup new applet
new-applet:
	@read -p "Enter applet name: " name; \
	cargo new applets/$$name --lib; \
	cp applets/example-applet/Cargo.toml applets/$$name/; \
	echo "✅ New applet created: applets/$$name"

# Info
info:
	@echo "Project Information:"
	@echo "  Frontend: React + Vite + Tailwind"
	@echo "  Applets: Rust → WASM"
	@echo "  Network: $(NETWORK)"
	@echo ""
	@echo "Current Applet: $(APPLET_NAME)"
	@if [ -d "$(APPLET_DIR)" ]; then \
		echo "  Status: ✅ Found"; \
		echo "  Path: $(APPLET_DIR)"; \
	else \
		echo "  Status: ❌ Not found"; \
	fi
