FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    build-essential \
    python3 \
    pkg-config \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxshmfence1 \
    libxext6 \
    libxfixes3 \
    libxrender1 \
    libdrm2 \
    libgl1 \
    xdg-utils \
    wget \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Prisma ENV
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy package files and install deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Make build.sh executable
RUN chmod +x ./build.sh

# Expose app port
EXPOSE 5000

# Start
CMD ["./build.sh"]
