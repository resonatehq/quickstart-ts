import * as resonate from "@resonatehq/sdk";

/**
 * Asynchronously downloads and summarizes the text from a given URL.
 * 
 * @param context - The context object provided by @resonatehq/sdk, used to run other asynchronous operations.
 * @param url - The URL of the page to download and summarize.
 * @returns A promise that resolves to a summary of the downloaded page's text.
 */
export async function downloadAndSummarize(context: Context, url: string) {

    // Summarize the content on a node with a gpu
    let summary = await context.run(`/gpu/summarize/summarize-${url}`, url);

    // Return the summary of the content
    return summary;
}