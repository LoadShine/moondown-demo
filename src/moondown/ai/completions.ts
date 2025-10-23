// src/moondown/ai/completions.ts
import OpenAI from "openai";
import {Stream} from "openai/streaming";

// Define return types
type ChatCompletionResponse = OpenAI.Chat.Completions.ChatCompletion;
type ChatCompletionStreamResponse = Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;

const openai = new OpenAI({
    apiKey: "nothing",
    baseURL: "https://ai-api-proxy-nine.vercel.app/api/glm",
    dangerouslyAllowBrowser: true,
});

// Regular chat completion method
export const chatCompletion = async (
    systemPrompt: string,
    userPrompt: string,
    signal?: AbortSignal
): Promise<ChatCompletionResponse> => {
    return openai.chat.completions.create(
        {
            model: 'glm-4-flash',
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            stream: false,
        },
        ...(signal ? [{signal}] : [])
    );
};

// Streaming chat completion method
export const chatCompletionStream = async (
    systemPrompt: string,
    userPrompt: string,
    signal?: AbortSignal
): Promise<ChatCompletionStreamResponse> => {
    return await openai.chat.completions.create(
        {
            model: 'glm-4.5-flash',
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            stream: true,
        },
        ...(signal ? [{signal}] : [])
    ) as ChatCompletionStreamResponse;
};
