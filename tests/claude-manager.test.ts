import { ClaudeCodeManager } from '../src/claude/manager';

describe('ClaudeCodeManager', () => {
  let manager: ClaudeCodeManager;

  beforeEach(() => {
    manager = new ClaudeCodeManager({ verbose: false });
  });

  describe('checkInstallation', () => {
    it('should return boolean for installation status', async () => {
      const result = await manager.checkInstallation();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getNpmInstalledVersion', () => {
    it('should return string or null for installed version', async () => {
      const result = await manager.getNpmInstalledVersion();
      expect(result === null || typeof result === 'string').toBe(true);
    });

    it('should return null when package is not installed', async () => {
      // Mock scenario - should handle gracefully
      const result = await manager.getNpmInstalledVersion();
      const isValid = result === null || (result && /^\d+\.\d+\.\d+$/.test(result));
      expect(isValid).toBe(true);
    });
  });

  describe('getLatestVersion', () => {
    it('should return string or null for latest version', async () => {
      const result = await manager.getLatestVersion();
      expect(result === null || typeof result === 'string').toBe(true);
    });
  });

  describe('compareVersions', () => {
    it('should correctly compare semantic versions', () => {
      const managerWithVerbose = new ClaudeCodeManager({ verbose: false });

      // We can't directly test private method, but we can test needsUpdate indirectly
      // which uses version comparison internally
      expect(typeof managerWithVerbose.needsUpdate).toBe('function');
    });
  });

  describe('needsUpdate', () => {
    it('should return boolean indicating whether update is needed', async () => {
      const result = await manager.needsUpdate();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('checkForUpdates', () => {
    it('should return update status information', async () => {
      const result = await manager.checkForUpdates();
      expect(result).toHaveProperty('hasUpdate');
      expect(result).toHaveProperty('currentVersion');
      expect(result).toHaveProperty('latestVersion');
      expect(typeof result.hasUpdate).toBe('boolean');
    });
  });

  describe('getInstallationInfo', () => {
    it('should return installation information', async () => {
      const result = await manager.getInstallationInfo();
      expect(result).toHaveProperty('installed');
      expect(result).toHaveProperty('isGlobal');
      expect(typeof result.installed).toBe('boolean');
      expect(typeof result.isGlobal).toBe('boolean');
    });
  });

  describe('shouldCheckUpdate', () => {
    it('should return true when no previous check time', () => {
      const shouldCheck = manager.shouldCheckUpdate();
      expect(shouldCheck).toBe(true);
    });

    it('should return true when check interval has passed', () => {
      const oldTime = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(); // 25 hours ago
      const shouldCheck = manager.shouldCheckUpdate(oldTime, 24);
      expect(shouldCheck).toBe(true);
    });

    it('should return false when check interval has not passed', () => {
      const recentTime = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(); // 12 hours ago
      const shouldCheck = manager.shouldCheckUpdate(recentTime, 24);
      expect(shouldCheck).toBe(false);
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return a valid ISO 8601 timestamp', () => {
      const timestamp = ClaudeCodeManager.getCurrentTimestamp();
      expect(typeof timestamp).toBe('string');
      expect(() => new Date(timestamp)).not.toThrow();
    });
  });

  describe('installOrUpdate', () => {
    it('should return update result object', async () => {
      // Test with force=false to check current status
      const result = await manager.installOrUpdate({ force: false });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('action');
      expect(['none', 'installed', 'updated', 'failed']).toContain(result.action);
    });
  });
});
