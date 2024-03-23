import express, { Request, Response } from "express";
import { Resonate, Context } from "@resonatehq/sdk/dist/async";
import { downloadAndSummarize } from "./app";

// Initialize a Resonate application.
const resonate = new Resonate({ url: "http://localhost:8001" });

// Register a function as a Resonate function
resonate.register("downloadAndSummarize", downloadAndSummarize, resonate.options({ timeout: Number.MAX_SAFE_INTEGER }));

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
