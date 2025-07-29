# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json yarn.lock ./
COPY frontend/package.json frontend/yarn.lock ./frontend/

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies (without --frozen-lockfile to allow updates)
RUN yarn install
RUN cd frontend && yarn install

# Copy application code
COPY . .

# Build the React frontend
RUN cd frontend && yarn build

# Expose port
EXPOSE 8080

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=8080

# Run the application
CMD ["python", "app.py"] 