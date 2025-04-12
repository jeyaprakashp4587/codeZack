import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {profileApi} from '../Api';

const fetchLatestVersionFromBackend = async () => {
  try {
    const {data, status} = await axios.get(
      `${profileApi}/Profile/Getlatest-version`,
    );

    if (status === 200) return data.version.trim();
  } catch (error) {
    console.error('Error fetching latest version:', error);
    return null;
  }
};

export const checkAppVersion = async navigation => {
  try {
    const currentVersion = DeviceInfo.getVersion().trim();
    const latestVersion = await fetchLatestVersionFromBackend();

    if (currentVersion !== latestVersion) {
      navigation.navigate('updatePageScreen');
    }
  } catch (error) {
    console.error('Error checking app version:', error);
  }
};
