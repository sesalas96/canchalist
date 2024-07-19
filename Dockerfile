# Stage 1: Build the application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20

# Set the working directory
WORKDIR /app

# Install dependencies and tools
RUN apt-get update && apt-get install -y curl jq python3 python3-pip unzip \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update \
    && rm -rf awscliv2.zip aws \
    && curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x ./kubectl \
    && mv ./kubectl /usr/local/bin/kubectl

# Copy only the production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Copy the .env file
COPY .env ./

# Add a user to run the application
RUN useradd --user-group --create-home --shell /bin/false appuser

# Change ownership of the application files
RUN chown -R appuser:appuser /app

# Switch to the new user
USER appuser

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD curl -f http://localhost:3000/health || exit 1

# Command to run the application
CMD ["npm", "run", "start:nextjs"]
