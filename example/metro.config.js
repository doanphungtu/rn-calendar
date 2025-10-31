const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const root = path.resolve(__dirname, '..');
const rootNodeModules = path.join(root, 'node_modules');

/**
 * Metro configuration for monorepo (expo + yarn workspaces)
 */
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];

config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => path.join(rootNodeModules, name),
  }
);

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
