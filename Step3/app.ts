import { Context } from "@resonatehq/sdk";

export async function downloadAndSummarize(context: Context, url: string) {

    // Summarize the content on a node with a gpu
    let summary = await context.run(`/gpu/summarize/summarize-${url}`, url, context.options({ poll: 2500 }));

    // Return the summary of the content
    return summary;
}