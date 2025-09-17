#!/bin/bash

echo "🚀 Starting NailFinder backend environment..."

# 1. Start Redis server
echo "🔄 Launching Redis..."
redis-server --daemonize yes

# 2. Start PostgreSQL service
echo "🗄️ Starting PostgreSQL..."
sudo service postgresql start

# 3. Install Node.js dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# 4. Start NestJS backend
echo "🧠 Starting the NestJS app..."
npm run start

echo "✅ NailFinder backend is up and running!"
