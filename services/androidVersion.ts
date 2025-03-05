import { TFunction } from 'i18next';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

export const checkAppVersion = async (t: TFunction) => {
  const currentVersion = VersionCheck.getCurrentVersion();
  const currentVersionArr = currentVersion.split('.').map((n) => parseInt(n));

  const latestVersion = await VersionCheck.getLatestVersion();
  const latestVersionArr = latestVersion.split('.').map((n) => parseInt(n));

  const updateNeededResult = await VersionCheck.needUpdate({
    currentVersion,
    latestVersion,
  });

  const updateNeeded =
    updateNeededResult.isNeeded ||
    latestVersionArr[0] > currentVersionArr[0] ||
    (latestVersionArr[0] === currentVersionArr[0] &&
      latestVersionArr[1] > currentVersionArr[1]);

  if (updateNeeded) {
    Alert.alert(
      t('updateAvailable'),
      t('updateAvailableMessage'),
      [
        {
          text: t('updateNow'),
          onPress: () => {
            Linking.openURL(updateNeededResult.storeUrl);
          },
        },
      ],
      { cancelable: false }
    );
  }
};
