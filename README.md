# SassGPT API

The SassGPT API is a Node.js server that uses the OpenAI API to generate sassy responses to user input. It is built using TypeScript and the Bun runtime.

## Installation

To install the SassGPT API, you will need to have Node.js and npm installed on your machine. You can download them from the official Node.js website: https://nodejs.org/en/download/

Once you have Node.js and npm installed, you can clone the SassGPT API repository from GitHub:

```
git clone https://github.com/your-username/sassgpt-api.git
```

Then, navigate to the project directory and install the dependencies:

```
cd sassgpt-api
npm install
```

## Building

To build the SassGPT API, you can use the following command:

```
npm run build
```

This will compile the TypeScript code and output the resulting JavaScript files to the `dist` directory.

## Running

To run the SassGPT API, you can use the following command:

```
npm start
```

This will start the server and listen for incoming requests on port 8080.

## API Endpoints

The SassGPT API has the following endpoints:

- `GET /api`: Returns a default message.
- `POST /api/chat`: Generates a sassy response to the given input.

To use the `POST /api/chat` endpoint, you can send a JSON payload with the following structure:

```json
{
  "body": {
    "text": "Hello, how are you?",
    "role": "user"
  }
}
```

This will generate a sassy response to the given input and return it in the response body.

## Docker

The SassGPT API can also be run using Docker. To build the Docker image, you can use the following command:

```
docker build -t sassgpt-api .
```

This will build the Docker image and tag it with the name `sassgpt-api`.

To run the Docker container, you can use the following command:

```
docker run -p 8080:8080 sassgpt-api
```

This will start the container and map port 8080 on the host to port 8080 in the container.

## License

The SassGPT API is licensed under the MIT License. See the LICENSE file for more information.
