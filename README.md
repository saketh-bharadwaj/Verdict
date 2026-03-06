## Verdict - Distributed Online Judge Platform

Verdict is a production-style backend scaffold for a distributed online judge platform inspired by competitive programming systems such as Codeforces. The project is focused on architecture, service boundaries, and safe execution design rather than delivering a fully finished product in a single step.

Competitive programming platforms need more than CRUD APIs. They must safely execute untrusted user code, evaluate it against hidden test cases, track verdicts in near real time, and absorb bursts of concurrent submissions during live contests. Verdict is structured to support that workload through queue-based judging and isolated worker execution.

## Overview

Verdict models the core backend architecture required for a scalable judging system:

- Users browse problems and submit source code.
- The API persists the submission record and pushes a job into a queue.
- Judge workers consume queued jobs independently from the API tier.
- Code execution is isolated behind a sandbox-oriented execution service.
- Verdicts and execution metrics are written back for retrieval by clients.

This repository currently provides the initial backend skeleton, worker pipeline, Docker-oriented infrastructure files, and a README that captures the intended production direction.

## Key Features

- User authentication
- Problem browsing
- Code submission
- Contest participation
- Leaderboard ranking
- Problem setter dashboard for adding problems and test cases
- Distributed code judging
- Real-time submission status

## System Architecture

Verdict is designed as a set of loosely coupled services so the API layer remains responsive while code evaluation scales horizontally.

### Components

- Frontend: future React application for contestants, setters, and contest administration
- API Server: Node.js + Express service for problem management, submissions, and client-facing endpoints
- Submission Queue: Redis + BullMQ for durable asynchronous submission processing
- Judge Workers: background workers that compile and execute code inside sandboxed Docker containers
- Database: PostgreSQL for users, problems, submissions, test cases, contests, and rankings

### Submission Flow

1. User submits code.
2. API stores the submission metadata.
3. API pushes a job to the submission queue.
4. A judge worker pulls the job.
5. The worker compiles and executes code inside Docker.
6. Output is evaluated against test cases.
7. Verdict and metrics are stored.
8. Frontend fetches or subscribes to updated submission status.

### Current Scaffold

The current implementation keeps persistence in memory to avoid prematurely locking the project into a specific ORM, but the module boundaries are already arranged for PostgreSQL-backed repositories. The worker uses a simulation-oriented execution service today, with an explicit Docker execution integration point for later replacement.

## Tech Stack

- Backend: Node.js, Express
- Queue System: Redis, BullMQ
- Database: PostgreSQL
- Execution Sandbox: Docker containers
- Future Infrastructure: Kubernetes for autoscaling judge workers
- Monitoring: Prometheus + Grafana

## Backend Structure

```text
backend/
	src/
		config/
		controllers/
		models/
		queue/
		routes/
		services/
		workers/
		app.js
	docker/
		judge-runner/
			Dockerfile
	.env.example
	Dockerfile
	package.json
	server.js
docker-compose.yml
```

### Implemented API Endpoints

- `POST /api/submission`
- `GET /api/submission/:id`
- `GET /api/problems`
- `POST /api/problem`

### Current Worker Behavior

The judge worker is intentionally structured in two layers:

- `judge.service.js` orchestrates problem lookup and execution requests.
- `execution.service.js` isolates the execution contract so simulation can later be replaced with Docker sandbox execution.

The scaffold currently simulates verdict generation for the following result states:

- `AC`
- `WA`
- `TLE`
- `RE`

## Data Model

The repository includes initial model definitions for:

- User
- Problem
- Submission
- Testcase

The `Submission` model includes:

- `userId`
- `problemId`
- `language`
- `sourceCode`
- `verdict`
- `executionTime`
- `memoryUsed`

## Security Considerations

Running untrusted code is the hardest part of an online judge. The architecture is designed around strict isolation and resource control.

- Container sandboxing: each submission should run inside an isolated container rather than inside the API or worker host process directly.
- Time limits: execution must be forcibly terminated when language or problem time limits are exceeded.
- Memory limits: each run should have enforced memory ceilings to prevent host exhaustion.
- Restricted filesystem: submissions should not have unrestricted access to host files, secrets, or mounted volumes.
- Isolated execution environment: network access, process spawning, and kernel-facing capabilities should be minimized or disabled.

The current scaffold does not fully enforce these guarantees yet. Instead, it preserves the correct separation of concerns so the sandbox implementation can be added without redesigning the API or queue pipeline.

## Docker-Based Execution Design

The repository includes:

- An API container definition for the backend service
- A worker container definition for queue consumers
- A placeholder `judge-runner` Docker image for future untrusted execution
- A `docker-compose.yml` file wiring API, worker, Redis, and PostgreSQL together

In a production deployment, the judge runner would be extended with:

- per-language runtime images
- cgroup-based CPU and memory controls
- read-only root filesystems where possible
- tmpfs-based scratch space
- seccomp/apparmor profiles
- job-level cleanup and artifact collection

## Local Development

1. Install backend dependencies.
2. Copy `backend/.env.example` to `backend/.env` if you want local overrides.
3. Start Redis and PostgreSQL using Docker Compose.
4. Run the API server and worker separately.

Example commands:

```bash
cd backend
npm install
npm run start
```

In another terminal:

```bash
cd backend
npm run worker
```

Or use Docker Compose for the infrastructure services:

```bash
docker compose up --build
```

## Future Improvements

- Autoscaling judge workers
- Multiple language support
- Contest rating system
- Live submission updates
- Advanced monitoring and logging

## Status

This repository is an initial architecture and backend skeleton for Verdict. It is suitable as a starting point for a production-style distributed judge, with clear boundaries for queue processing, execution isolation, and future horizontal scaling.
