import { LaunchOptions } from '../launcher';
export interface AppOptions {
    verbose?: boolean;
    quiet?: boolean;
    additionalArgs?: string[];
    thinkingModel?: string;
}
export declare class SyntheticClaudeApp {
    private configManager;
    private ui;
    private launcher;
    private modelManager;
    private claudeCodeManager;
    constructor();
    setupLogging(options: AppOptions): Promise<void>;
    getConfig(): {
        apiKey: string;
        baseUrl: string;
        anthropicBaseUrl: string;
        modelsApiUrl: string;
        cacheDurationHours: number;
        selectedModel: string;
        selectedThinkingModel: string;
        firstRunCompleted: boolean;
        autoUpdateClaudeCode: boolean;
        claudeCodeUpdateCheckInterval: number;
        maxTokenSize: number;
        lastClaudeCodeUpdateCheck?: string | undefined;
    };
    private getModelManager;
    run(options: AppOptions & LaunchOptions): Promise<void>;
    /**
     * Check and update Claude Code if needed
     * Skips if autoupdate is disabled or if it hasn't been long enough since last check
     */
    ensureClaudeCodeUpdated(): Promise<void>;
    /**
     * Update synclaude and Claude Code to the latest version
     */
    updateClaudeCode(force?: boolean): Promise<void>;
    /**
     * Compare two semver versions
     * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
     */
    private compareVersions;
    /**
     * Get latest synclaude version from GitHub repository
     */
    private getLatestGitHubVersion;
    /**
     * Update synclaude itself via npm
     */
    private updateSynclaudeSelf;
    /**
     * Check if there are available updates without installing
     */
    checkForUpdates(): Promise<void>;
    interactiveModelSelection(): Promise<boolean>;
    interactiveThinkingModelSelection(): Promise<boolean>;
    listModels(options: {
        refresh?: boolean;
    }): Promise<void>;
    searchModels(query: string, options: {
        refresh?: boolean;
    }): Promise<void>;
    showConfig(): Promise<void>;
    setConfig(key: string, value: string): Promise<void>;
    resetConfig(): Promise<void>;
    setup(): Promise<void>;
    doctor(): Promise<void>;
    clearCache(): Promise<void>;
    cacheInfo(): Promise<void>;
    private selectModel;
    private selectThinkingModel;
    /**
     * Install synclaude from local directory to system-wide
     * Builds the project and uses npm link -g for system-wide installation
     */
    localInstall(options: {
        verbose?: boolean;
        force?: boolean;
        skipPath?: boolean;
    }): Promise<void>;
    private launchClaudeCode;
}
//# sourceMappingURL=app.d.ts.map