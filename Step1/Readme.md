# Quickstart • Step 1 🏴‍☠️

Build your first Distributed Async Await application using the Resonate SDK, enjoying transparent retries, rate limits, tracing, and metrics. Without depending on any platform or infrastructure.

## Installation & Running the Application

#### Installing the Application

Clone the repository, navigate to the ./Step1 directory, and install the dependencies:

```bash
npm install
```
#### Running the Application

To launch your application, enter:

```bash
npm start
```

## Understanding the Application

The Express web application exposes the `/summarize` calls `downloadAndSummarize` via `resonate.run`  

```typescript
import express, { Request, Response } from "express";
import { Resonate, Context } from "@resonatehq/sdk";
import { downloadAndSummarize } from "./app";

// Initialize a Resonate application.
const resonate = new Resonate();

// Register a function as a Resonate function
resonate.register("downloadAndSummarize", downloadAndSummarize, resonate.options({ timeout: 20000 }));

// Start the Resonate application
resonate.start();

// Initialize an Express application.
const app = express().use(express.json());

// Register a function as an Express endpoint
app.post("/summarize", async (req: Request, res: Response) => {
    const url = req.body?.url;
    try {
        // Call the resonate function
        let summary = await resonate.run("downloadAndSummarize", /* id */ `summarize-${url}`, /* param */ url);
        res.send(summary);
    } catch (e) {
        res.status(500).send("An error occurred.");
    }
});

// Start the Express application
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
```

#### Experiment with the Application

Test the app by sending a POST request to the `/summarize` endpoint. On the first request, the app simulates downloading and summarizing, introducing a delay of 5 sec.

```bash
# Summarize a URL for the first time
$ curl -X POST http://localhost:3000/summarize -H "Content-Type: application/json" -d '{"url": "http://example.com"}'
```

On subsequent requests with the same URL, the SDK's deduplicates the request: A resonate function execution and its associated promise have an identity, here `summarize-${url}`. Using the same identity yields the same result (see [Memoization](https://en.wikipedia.org/wiki/Memoization) for an introduction).

```bash
# Summarize the URL for the second time
$ curl -X POST http://localhost:3000/summarize -H "Content-Type: application/json" -d '{"url": "http://example.com"}'
```

Restarting the application without a connected Resonate Server means starting afresh, as previous states aren't preserved. This demonstrates the necessity of persistent state management for distributed applications.
