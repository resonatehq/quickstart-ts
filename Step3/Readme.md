# Quickstart • Step 3 🏴‍☠️

Boost your application's **scalability** by deploying Resonate Workers, enabling fan out and fan in to mitigate demand.

## Installation & Running the Application

#### Installing the Application

Install the Resonate Server (see [Installation Instractions]() for installation options):

```bash
brew install resonatehq/tap/resonate
```

Clone the repository, navigate to the ./Step3 directory, and install the dependencies:

```bash
npm install
```

#### Running the Application

To launch the Resonate Server (which will pick up the resonate.yml file in the current directory), enter:

```bash
resonate serve
```

In a new terminal, to launch your application, enter:

```bash
npm start
```

In a new terminal, to launch your application, enter:

```bash
npm run start-worker
```

## Understanding the Application

The application is the same as the application from Step 2, with one difference: We are not processing the summarization locally but remotely:

```typescript
export async function downloadAndSummarize(context: Context, url: string) {
  // Summarize the content on a node with a gpu
  let summary = await context.run(`/gpu/summarize/summarize-${url}`, url);

  // Return the summary of the content
  return summary;
}
```

The resonate server is configured to forward any Durable Promise with a matching Promise Identifier (pid) to a task queue, here an http endpoint:

```yaml
# api:
#   baseUrl: http://example.com

aio:
  subsystems:
    queuing:
      config:
        connections:
          - kind: http
            name: summarize
            metadata:
              properties:
                url: http://localhost:5001

        routes:
          - kind: pattern
            name: default
            target:
              connection: summarize
              queue: analytics
            metadata:
              properties:
                pattern: /gpu/summarize/*
```

The files `worker.ts` and `worker.py` illustrate how to develop a Resonate Worker listening on a http task queue from scratch.

#### Experiment with the Application

On request, the app creates a Durable Promise and waits for the remote execution to finish.

```bash
curl -X POST http://localhost:3000/summarize -H "Content-Type: application/json" -d '{"url": "http://example.com"}'
```

The worker logs processing the task:

```bash
Task received
Claiming task /gpu/summarize/summarize-http://example.com
Task claimed /gpu/summarize/summarize-http://example.com
Completing task /gpu/summarize/summarize-http://example.com
Completed task /gpu/summarize/summarize-http://example.com
```
