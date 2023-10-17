#!/bin/bash

# Define constants
IMAGE_NAME="sassai-api"
PORT_MAPPING="8080:8080"
ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Check if Docker build was successful
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed!"
    exit 1
fi

# Check if an old instance of the Docker container is running and stop it
OLD_CONTAINER_ID=$(docker ps -q -f ancestor=$IMAGE_NAME)
if [ ! -z "$OLD_CONTAINER_ID" ]; then
    echo "Stopping old container..."
    docker stop $OLD_CONTAINER_ID
fi

# Run the Docker container
echo "Running Docker container..."
docker run --env-file $ENV_FILE -p $PORT_MAPPING $IMAGE_NAME

# Check if Docker run was successful
if [ $? -ne 0 ]; then
    echo "Error: Docker run failed!"
    exit 1
fi

echo "Deployment completed successfully!"
