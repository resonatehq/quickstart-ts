import { Context } from "@resonatehq/sdk";

export async function downloadAndSummarize(context: Context, url: string) {
    // Download the content from the provided URL
    let content = await context.run(download, url);

    // Summarize the downloaded content
    let summary = await context.run(summarize, content);

    // Return the summary of the content
    return summary;
}

async function download(context: Context, url: string) : Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.1) { // 10% chance to fail
                reject("download failed");
            } else {
                resolve("This is the text of the page");
            }
        }, 2500);
    })
}

async function summarize(context: Context, text: string) : Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.1) { // 10% chance to fail
                reject("summarize failed");
            } else {
                resolve("This is a summary of the text");
            }
        }, 2500);
    });
}