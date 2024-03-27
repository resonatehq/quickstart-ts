# Quickstart • Step 2 🏴‍☠️

boost your application's **reliability** by integrating with a Resonate Server, enabling recovery to mitigate failures.

## Installation & Running the Application

#### Prerequisites

- NodeJS

#### Installing the Application

Install the Resonate Server (see [Installation Instractions](https://docs.resonatehq.io/resonate/quickstart) for installation options):

```
brew install --build-from-source resonate-hq/resonate/installation/brew/Formula/resonate.rb
```

Clone the repository, navigate to the ./Step2 directory, and install the dependencies:

```bash
npm install
```
#### Running the Application

To launch the Resonate Server, enter:

```bash
resonate serve
```

In a new terminal, to launch your application, enter:

```bash
npm start
```

## Understanding the Application

The application is the same as the application from Step 1, with one difference:

```typescript
// Initialize a Resonate application with a reference to the Resonate Server
const resonate = new Resonate({ url: "http://localhost:8001" });
```

#### Experiment with the Application

Test the app by sending a POST request to the `/summarize` endpoint. The app simulates downloading and summarizing, introducing a delay of 5 sec. If `download` or `summarize` raise an exception, Resonate will retry the function call.

```bash
curl -X POST http://localhost:3000/summarize -H "Content-Type: application/json" -d '{"url": "http://example.com"}'
```

The Resoante SDK connects to the Resonate Server to track the state of an execution, or more accurately the state of the promises representing an execution. You can inspect the state via the Resonate CLI.

```bash
resonate promise get summarize-http://example.com
```

```
Id:       summarize-http://example.com
State:    RESOLVED
Timeout:  9008909898871320

Idempotency Key (create):    summarize-http://example.com
Idempotency Key (complete):  summarize-http://example.com

Param:
  Headers:
  Data:
    {"func":"downloadAndSummarize","args":["http://example.com"]}

Value:
  Headers:
  Data:
    "This is a summary of the text"

Tags:
  resonate:invocation:  true
```

To learn more about Durable Promises, visit the [Durable Promise Specification](https://github.com/resonatehq/durable-promise-specification)

# tl;dr

- `resonate.run` marks the transition from async await to Distributed Async Await
- `resonate.run` requires a unique identifer invocation. If the same identifer is used, `resonate.run` returns the same execution.
- `resonate.run` adds transparent retries, rate limits, or tracing, simply through the integration of the Resonate SDK, without the need for any additional infrastructure.
- When connected to a Resonate Server, `resonate.run` tracks the state of an execution, or more accurately the state of its durable promise