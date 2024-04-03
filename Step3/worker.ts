import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.post('/', (req: Request, res: Response) => {
  console.log("Task received", req.body);
  try {
    process(req.body).catch(error => console.error("Error while processing task", error));
    res.status(200);
  } catch (e) {
    console.error("Error", e);
    res.status(500);
  }
});

async function process(request: any): Promise<void> {

    const { taskId, counter, links: { claim: claimUrl, complete: completeUrl } } = request;

  console.log("Claiming task", taskId, counter);

  // Claim the task
  let response = await fetch(claimUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId,
      counter,
      processId: 'process-id',
      executionId: 'execution-id',
      expiryInMilliseconds: 60,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error claiming task: ${response}`);
  }
  
  let data = await response.json();

  console.log("Task claimed", response);

  // BUSINESS LOGIC
  let summary = "This is a summary of the text";
  // BUSINESS LOGIC

  // Complete the task

  console.log("Completing task", taskId, counter);

  response = await fetch(completeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId,
      counter,
      executionId: 'execution-id',
      state: 'resolved',
      value: {
        headers: { 'Content-Type': 'application/json' },
        data: Buffer.from(JSON.stringify(summary)).toString('base64'),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  data = await response.json();

  console.log("Task completed", taskId, counter);

}

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Starting worker on port ${PORT}\n`);
});
