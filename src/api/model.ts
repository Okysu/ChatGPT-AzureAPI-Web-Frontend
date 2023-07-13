import request from ".";

interface message {
  role: string;
  content: string;
}

/**
 * request AI
 * @param {message[]} messages
 * @param {options} options
 */
export const requestAI = (messages: message[], options: options) => {
  // options type change
  const modelOptions = {
    model: options.model,
    maxTokens: options.maxTokens ? parseInt(options.maxTokens) : 1000,
    temperature: options.temperature ? parseFloat(options.temperature) : 0.9,
    topP: options.topP ? parseFloat(options.topP) : 1,
    presencePenalty: options.presencePenalty
      ? parseFloat(options.presencePenalty)
      : 0,
    frequencyPenalty: options.frequencyPenalty
      ? parseFloat(options.frequencyPenalty)
      : 0,
  };

  return request.post("/model/" + options.model, {
    messages: messages,
    options: modelOptions,
  });
};
