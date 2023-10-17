# Use the Bun runtime as the base image
FROM oven/bun

# Set the working directory in the container
WORKDIR /usr/src/app/src

# Copy the local package files to the container's workspace
COPY ./ ./

# Install any dependencies
RUN bun install

# Environment variable for port number the server will listen on
ENV PORT=8080

# Allow traffic on specified port
EXPOSE $PORT

# Command to run the application
CMD ["bun", "run", "index.ts"]
