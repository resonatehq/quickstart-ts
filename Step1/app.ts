import { Context } from "@resonatehq/sdk";

/**
 * Asynchronously downloads and summarizes the text from a given URL.
 * 
 * @param context - The context object provided by @resonatehq/sdk, used to run other asynchronous operations.
 * @param url - The URL of the page to download and summarize.
 * @returns A promise that resolves to a summary of the downloaded page's text.
 */
export async function downloadAndSummarize(context: Context, url: string) {
    // Download the content from the provided URL
    let content = await context.run(download, url);

    // Summarize the downloaded content
    let summary = await context.run(summarize, content);

    // Return the summary of the content
    return summary;
}

/**
 * Simulates downloading content from a URL.
 * 
 * This is a mock function that simulates the asynchronous action of downloading content by using a timeout.
 * 
 * @param context - The context object, not used here but included for consistency and potential future use.
 * @param url - The URL from which to "download" the content.
 * @returns A promise that resolves to a string representing the downloaded content.
 */
async function download(context: Context, url: string) : Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.1) { // 10% chance to fail
                reject("Download failed due to a network error.");
            } else {
                resolve("This is the text of the page");
            }
        }, 2500);
    })
}

/**
 * Simulates summarizing text content.
 * 
 * This is a mock function that simulates the action of summarizing text content by using a timeout.
 * 
 * @param context - The context object, not used here but included for consistency and potential future use.
 * @param text - The text to be summarized.
 * @returns A promise that resolves to a string representing the summary of the input text.
 */
async function summarize(context: Context, text: string) : Promise<string> {
    return new Promise((resolve, reject) => {
        // Simulate summarizing content by resolving with a static string after a delay
        setTimeout(() => {
            if (Math.random() < 0.1) { // 10% chance to fail
                reject("Download failed due to a network error.");
            } else {
                resolve("This is a summary of the text");
            }
        }, 2500);
    });
}
