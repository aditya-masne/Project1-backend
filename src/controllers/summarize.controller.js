import OpenAI from "openai";
import { ApiResponse } from "../utils/ApiResponse.js"; // Assuming ApiResponse is implemented correctly
import { ApiError } from "../utils/ApiError.js"; // Assuming ApiError is implemented correctly

// Initialize the OpenAI model using OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.MODEL_API_KEY, // Ensure this environment variable is set
});

// Summarizer function without LangChain
const summarizer = async (req, res) => {
  try {
    const { context, question } = req.body;

    // Validate inputs
    if (!context || !question) {
      return res.status(400).json({
        success: false,
        message: "Both 'context' and 'question' are required."
      });
    }

    // Prepare the messages to send to the OpenAI model
    const messages = [
      {
        role: "system",
        content: `Context: ${context}`, // Include the context in the system role
      },
      {
        role: "user",
        content: question, // The actual question from the user
      },
    ];

    // Call OpenAI's chat API to get a completion
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // Use the model as specified
      messages: messages, // Send the context and question
    });

    // Return the response to the client
    return res.status(201).json(
      new ApiResponse(200, completion.choices[0].message.content, "Answer shared successfully")
    );

  } catch (error) {
    console.error("Error processing the request:", error.message);
    throw new ApiError(501, error?.message || "Error while generating response.");
  }
};

export {
  summarizer,
};
