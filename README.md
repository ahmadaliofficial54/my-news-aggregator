My News Aggregator

Welcome to My News Aggregator – a Next.js 13 project that fetches news from multiple sources (Guardian, NewsAPI, and New York Times). This guide walks you through setting up and running the project locally, as well as containerizing and running it with Docker.

## Table of Contents
####  1.	Prerequisites
####  2.	Installation
####	3.	Local Development (Without Docker)
####	4.	Environment Variables
####	5.	Docker & Docker Compose Setup
####	6.	Build & Run With Docker Compose
####	7.	Stopping the Container

## Prerequisites

####	•	Node.js 18+ (if you plan to run locally without Docker)
####	•	Docker installed on your machine (for containerized runs)
####	•	Docker Compose (often bundled with Docker Desktop on Windows/Mac)

## Installation
git clone https://github.com/asadmehmood091/my-news-aggregator.git
cd my-news-aggregator

### Install Dependencies:
```bash
npm install
```


### Build and Run (for local dev, no Docker):
```bash
npm run dev
```

### Environment Variables
```
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
NYTIMES_API_KEY=your_nyt_key
Please create the .env file and copy the values from .env.develop
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker & Docker Compose Setup
### Dockerfile:

```
# Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```
### docker-compose.yml
```
version: '3.8'

services:
  news-aggregator:
    container_name: my-news-aggregator-container
    build: .
    ports:
      - '3000:3000'
    environment:
      NEWS_API_KEY: ${NEWS_API_KEY}
      GUARDIAN_API_KEY: ${GUARDIAN_API_KEY}
      NYTIMES_API_KEY: ${NYTIMES_API_KEY}
```

## Build & Run With Docker Compose

	 Ensure you have a valid .env containing your API keys in the project root (e.g., NEWS_API_KEY=xxx).

 ### Build the Docker Image:

 ```
docker compose build  
```
### Start the Container:

```
docker compose up   
```

Visit http://localhost:3000 to see your Next.js app running inside Docker.

## Stopping the Container
Press CTRL + C in the terminal where docker compose up is running.
### Or run:
```
docker compose down
```
This stops and removes the container. If you want to remove the built image as well:

```
docker compose down --rmi all
```

### Congratulations!

#### You’ve successfully:

#### 	•	Installed all dependencies locally.
#### 	•	Run the app in development mode at http://localhost:3000.
#### • Built and deployed the app inside a Docker container using Docker Compose.
