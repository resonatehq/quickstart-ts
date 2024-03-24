# Quickstart • Step 1 🏴‍☠️

Explore **Distributed Async Await** with the Resonate SDK. This guide walks you throught the basics to create an application showcasing features like transparent retries, rate limits, and tracing—no additional infrastructure needed.

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

Built on Express, this web app exposes a /summarize http handler that calls  calls `downloadAndSummarize` via `resonate.run`. transitioning from async await to Distributed Async Await.

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
        // Call the resonate function with a unique identifer
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

Similar to the Express web application, we instantiate a resonate object, register the functions we intend to call via `resonate.run`, and start the application.

`resonate.run` requires a unique identifer. If you supply the same identifer, `resonate.run` returns the same execution－or rather the same promise representing the execution.

From hereon, Resonate manages the function execution, adding retries, rate limiting, or tracing.

```typescript
export async function downloadAndSummarize(context: Context, url: string) {
    // Download the content from the provided URL
    let content = await context.run(download, url);

    // Summarize the downloaded content
    let summary = await context.run(summarize, content);

    // Return the summary of the content
    return summary;
}
```

Resonate calls every function with a Context object as the first argument. You have to call asynchronous functions via context.run so Resonate is able to control the execution.

#### Experiment with the Application

Test the app by sending a POST request to the `/summarize` endpoint. The app simulates downloading and summarizing, introducing a delay of 5 sec. If `download` or `summarize` raise an exception, Resonate will retry the function call.

```bash
curl -X POST http://localhost:3000/summarize -H "Content-Type: application/json" -d '{"url": "http://example.com"}'
```

On subsequent requests with the same URL, Resonate does not start the execution again but returns the same promise. However, restarting the application without a connected Resonate Server means starting afresh, as previous states aren't preserved.

# tl;dr

- `resonate.run` marks the transition from async await to Distributed Async Await
- `resonate.run` requires a unique identifer invocation. If the same identifer is used, `resonate.run` returns the same execution.
- `resonate.run` adds transparent retries, rate limits, or tracing, simply through the integration of the Resonate SDK, without the need for any additional infrastructure.