import {useNavigation} from '@react-navigation/native';
import {Alert, Linking} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const checkAppVersion = async () => {
  const navigation = useNavigation();
  try {
    const currentVersion = DeviceInfo.getVersion().trim(); // Trim for safety
    const latestVersion = await fetchLatestVersionFromBackend();

    console.log(
      `Current Version: ${currentVersion}, Latest Version: ${latestVersion}`,
    );

    if (currentVersion !== latestVersion) {
      // showUpdateAlert();
      navigation.navigate('updatePageScreen');
    }
  } catch (error) {
    console.error('Error checking app version:', error);
  }
};

const fetchLatestVersionFromBackend = async () => {
  try {
    const response = await fetch('https://your-backend.com/api/latest-version');
    if (!response.ok)
      throw new Error(`Failed to fetch version: ${response.status}`);

    const data = await response.json();
    return data.version.trim(); // Trim for consistency
  } catch (error) {
    console.error('Error fetching latest version:', error);
    return null; // Handle gracefully if backend fails
  }
};
