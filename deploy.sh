#!/bin/bash

# Event Finder App Deployment Script for Fly.io

echo "🚀 Starting deployment to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "   https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Please log in to Fly.io..."
    flyctl auth login
fi

# Deploy the application
echo "📦 Deploying application..."
flyctl deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Opening application..."
    flyctl open
else
    echo "❌ Deployment failed. Check the logs above for details."
    echo "📋 To view logs: flyctl logs"
    exit 1
fi 