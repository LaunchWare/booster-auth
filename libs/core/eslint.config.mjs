import baseConfig from '@launchware/eslint-config-node';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import getConfiguration as per the README
// Note: baseConfig is the entire module import, so getConfiguration is a property on it.
const getLaunchwareConfiguration = baseConfig.getConfiguration;

const tsconfigRootDir = __dirname;

// Call getLaunchwareConfiguration as per README
const launchEslintConfigs = getLaunchwareConfiguration({ tsconfigRootDir });

// The actual array of configs is under .configs.recommended
const recommendedConfigs = launchEslintConfigs.configs.recommended;

export default tseslint.config(
  {
    // Explicitly add the plugin. This might be redundant if recommendedConfigs includes it,
    // but it can solve issues if the plugin isn't correctly exposed by the base config.
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    }
  },
  ...recommendedConfigs, // Spread the recommended configs
  {
    // Project-specific overrides or additional configurations
    files: ['src/**/*.ts'],
    // languageOptions might be needed here if not fully covered by recommendedConfigs
    // For example, if recommendedConfigs doesn't set the parser.
    // However, getLaunchwareConfiguration is supposed to handle TS setup.
  }
);
