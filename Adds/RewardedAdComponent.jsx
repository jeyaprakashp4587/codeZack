import {useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {useRewardedAd, TestIds} from 'react-native-google-mobile-ads';

const useRewardedAdHook = () => {
  const {
    show: showRewardedAd,
    isLoaded: isRewardedAdLoaded,
    load: loadRewardedAd,
  } = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : '<YOUR_AD_UNIT_ID>', // Replace with your real ad unit ID
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );

  // Load the rewarded ad when the hook is initialized
  useEffect(() => {
    loadRewardedAd();
  }, [loadRewardedAd]);

  // Function to safely show the rewarded ad
  const handleShowRewardedAd = useCallback(() => {
    if (isRewardedAdLoaded) {
      showRewardedAd();
    } else {
      Alert.alert('Ad Not Ready', 'Please wait for the ad to load.');
    }
  }, [isRewardedAdLoaded, showRewardedAd]);

  return {
    showRewardedAd: handleShowRewardedAd,
    isRewardedAdLoaded,
  };
};

export default useRewardedAdHook;
