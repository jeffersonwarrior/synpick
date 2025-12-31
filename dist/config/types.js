"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSaveError = exports.ConfigLoadError = exports.ConfigValidationError = exports.AppConfigSchema = void 0;
const zod_1 = require("zod");
exports.AppConfigSchema = zod_1.z.object({
    apiKey: zod_1.z.string().default('').describe('Synthetic API key'),
    baseUrl: zod_1.z.string().default('https://api.synthetic.new').describe('Synthetic API base URL'),
    anthropicBaseUrl: zod_1.z
        .string()
        .default('https://api.synthetic.new/anthropic')
        .describe('Anthropic-compatible API endpoint'),
    modelsApiUrl: zod_1.z
        .string()
        .default('https://api.synthetic.new/openai/v1/models')
        .describe('OpenAI-compatible models endpoint'),
    cacheDurationHours: zod_1.z
        .number()
        .int()
        .min(1)
        .max(168)
        .default(24)
        .describe('Model cache duration in hours'),
    selectedModel: zod_1.z.string().default('').describe('Last selected model'),
    selectedThinkingModel: zod_1.z.string().default('').describe('Last selected thinking model'),
    firstRunCompleted: zod_1.z
        .boolean()
        .default(false)
        .describe('Whether first-time setup has been completed'),
    autoUpdateClaudeCode: zod_1.z
        .boolean()
        .default(true)
        .describe('Whether to automatically check for Claude Code updates'),
    claudeCodeUpdateCheckInterval: zod_1.z
        .number()
        .int()
        .min(1)
        .max(720)
        .default(24)
        .describe('Hours between Claude Code update checks'),
    lastClaudeCodeUpdateCheck: zod_1.z
        .string()
        .optional()
        .describe('Last Claude Code update check timestamp (ISO 8601)'),
    maxTokenSize: zod_1.z
        .number()
        .int()
        .min(1000)
        .max(200000)
        .default(128000)
        .describe('Max token size for Claude Code context window'),
});
class ConfigValidationError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'ConfigValidationError';
    }
}
exports.ConfigValidationError = ConfigValidationError;
class ConfigLoadError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'ConfigLoadError';
    }
}
exports.ConfigLoadError = ConfigLoadError;
class ConfigSaveError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'ConfigSaveError';
    }
}
exports.ConfigSaveError = ConfigSaveError;
//# sourceMappingURL=types.js.map