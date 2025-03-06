// android-manifest-launch-mode-plugin.js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidLaunchMode(config) {
  return withAndroidManifest(config, (config) => {
    const mainActivity =
      config.modResults.manifest.application[0].activity.find(
        (activity) => activity.$['android:name'] === '.MainActivity'
      );

    if (mainActivity) {
      mainActivity.$['android:launchMode'] = 'standard'; // purchases require "standard" or "singleTop" to avoid purchase cancellation
    }

    return config;
  });
};
