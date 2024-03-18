import express, { Request, Response } from "express";
import { Resonate, Context } from "@resonatehq/sdk";
import { downloadAndSummarize } from "./app";

// Initialize a Resonate application.
const resonate = new Resonate({ url: "http://localhost:8001" });

resonate.register("downloadAndSummarize", downloadAndSummarize, resonate.options({ timeout: Number.MAX_SAFE_INTEGER }));

const app = express();

app.use(express.json())

app.post("/summarize", async (req: Request, res: Response) => {
    const url = req.body?.url;
    try {
        res.send(await resonate.run("downloadAndSummarize", url, url))
    } catch (e) {
        res.status(500);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});