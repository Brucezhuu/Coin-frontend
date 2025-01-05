# React Frontend for Coin Calculator

This is the frontend for the Coin Calculator application. It allows users to input a target amount and select coin denominations to calculate the minimum number of coins required.

My Application Websit: http://3.27.234.183/

## Features
- Interactive UI for target amount input and coin denomination selection
- API integration with the backend
- Dockerized for easy deployment

---

## Prerequisites
- Node.js and npm (for local development)
- Docker (for containerized deployment)

---

## Local Development
To run the React app locally:

1. Clone the repository:
   ```bash
   git clone <repository-url> frontend
   cd frontend
   ```
2. Install dependencies:

    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```
4. Open the app in your browser:
    http://localhost:3000

## Steps to Build and Run the Docker Container
1. Build the Docker image:

```bash
docker build -t coinfrontend .
```
2. Run the container:

```bash
docker run -d -p 80:80 coinfrontend
```
3. Access the app in your browser:
```ARDUINO
http://<your-server-ip>
```
## Environment Variables
If you deploy this project, you can customize the backend API URL in the source code (App.js). Update the API URL to point to your backend service:
```JAVASCRIPT
const response = await fetch("http://<your-backend-ip>:8080/api/compute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        targetAmount: parseFloat(targetAmount),
        coinDenominations: selectedDenominations,
    }),
});
```


## Using Docker Compose to Run Frontend and Backend
You can use docker-compose to run both the frontend and backend services together. Here is how:

1. Create a docker-compose.yml File
In the root directory of your project (outside both the frontend and backend folders), create a docker-compose.yml file with the following content:

```yaml
version: "3.8"
services:
  backend:
    build:
      context: ./hola-dropwizard
    ports:
      - "8080:8080"

  frontend:
    build:
      context: ./coinfrontend
    ports:
      - "80:80"
```
2. Directory Structure
Ensure your project directory is structured as follows:
```lua
project-root/
├── docker-compose.yml
├── hola-dropwizard/
│   ├── Dockerfile
│   ├── config.yml
│   └── ... (backend files)
├── coinfrontend/
│   ├── Dockerfile
│   ├── package.json
│   └── ... (frontend files)
```
3. Start Both Services
Run the following command in the root directory where docker-compose.yml is located:
```bash
docker-compose up --build
```

4. Access the Services

- Frontend: Open your browser and go to http://<EC2 Public IP> (or http://localhost if running locally).

- Backend: The backend will be accessible at http://<EC2 Public IP>:8080/api/compute.
