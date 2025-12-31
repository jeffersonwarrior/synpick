import { z } from 'zod';
export declare const ModelInfoSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodDefault<z.ZodString>;
    created: z.ZodOptional<z.ZodNumber>;
    owned_by: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    always_on: z.ZodOptional<z.ZodBoolean>;
    hugging_face_id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    input_modalities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    output_modalities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    context_length: z.ZodOptional<z.ZodNumber>;
    max_output_length: z.ZodOptional<z.ZodNumber>;
    pricing: z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        completion: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        request: z.ZodOptional<z.ZodString>;
        input_cache_reads: z.ZodOptional<z.ZodString>;
        input_cache_writes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    quantization: z.ZodOptional<z.ZodString>;
    supported_sampling_parameters: z.ZodOptional<z.ZodArray<z.ZodString>>;
    supported_features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    openrouter: z.ZodOptional<z.ZodObject<{
        slug: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    datacenters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        country_code: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type ModelInfo = z.infer<typeof ModelInfoSchema>;
export interface CacheInfo {
    exists: boolean;
    filePath?: string;
    modifiedTime?: string;
    sizeBytes?: number;
    modelCount?: number;
    isValid?: boolean;
    error?: string;
}
export interface ApiModelsResponse {
    data: ModelInfo[];
    object?: string;
}
export declare class ModelValidationError extends Error {
    cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
export declare class ApiError extends Error {
    status?: number | undefined;
    response?: any | undefined;
    constructor(message: string, status?: number | undefined, response?: any | undefined);
}
//# sourceMappingURL=types.d.ts.map