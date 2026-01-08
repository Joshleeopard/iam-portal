#!/bin/bash
# Setup script for IAM Access Portal

echo "==================================="
echo "IAM Access Portal - Setup"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Backend setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend

if [ ! -d "../venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv ../venv
else
    echo "Virtual environment already exists"
fi

echo "Activating virtual environment..."
source ../venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

cd ..
echo -e "${GREEN}Backend setup complete!${NC}"
echo ""

# Frontend setup
echo -e "${YELLOW}Setting up frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node modules already installed"
fi

cd ..
echo -e "${GREEN}Frontend setup complete!${NC}"
echo ""

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}Note: Please update .env with your configuration${NC}"
fi

echo ""
echo -e "${GREEN}==================================="
echo "Setup Complete!"
echo "===================================${NC}"
echo ""
echo "To start the application:"
echo "  1. Backend:  ./start-backend.sh"
echo "  2. Frontend: ./start-frontend.sh"
echo ""
echo "Or run them manually:"
echo "  Backend:  cd backend && source ../venv/bin/activate && python run.py"
echo "  Frontend: cd frontend && npm run dev"
echo ""
