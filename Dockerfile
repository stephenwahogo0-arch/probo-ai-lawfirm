# VORTEX UNIFIED MULTI-RUNTIME ENVIRONMENT
FROM python:3.12-slim

# Install Node, Ruby, Go, Elixir dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    ruby-full \
    golang-go \
    elixir \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup Python Backend
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Setup Node Frontend
COPY package*.json ./
RUN npm install

# Copy everything
COPY . .

# Build frontend
RUN npm run build

EXPOSE 8000
EXPOSE 5173

# Default to running the Python VORTEX Core
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
