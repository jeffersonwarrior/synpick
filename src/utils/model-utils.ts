/**
 * Model utility functions
 */

/**
 * Checks if a model ID represents a thinking-capable AI model.
 *
 * Thinking models are AI models specifically designed for
 * extended reasoning and complex problem-solving tasks,
 * often using chain-of-thought reasoning.
 *
 * @param modelId - The model identifier to check
 * @returns true if the model is identified as a thinking model, false otherwise
 */
export function isThinkingModel(modelId: string): boolean {
  const id = modelId.toLowerCase();

  // Direct "thinking" keyword
  if (id.includes('thinking')) {
    return true;
  }

  // Known thinking model patterns
  if (id.includes('minimax') && (id.includes('2') || id.includes('3'))) {
    return true;
  }

  if (id.includes('deepseek-r1') || id.includes('deepseek-r2') || id.includes('deepseek-r3')) {
    return true;
  }

  if (id.includes('deepseek') && (id.includes('3.2') || id.includes('3-2'))) {
    return true;
  }

  if (id.includes('qwq')) {
    return true;
  }

  if (id.includes('o1')) {
    return true; // OpenAI o1 series
  }

  if (id.includes('o3')) {
    return true; // OpenAI o3 series
  }

  if (id.includes('qwen3')) {
    return true; // Qwen 3 thinking variants
  }

  return false;
}
