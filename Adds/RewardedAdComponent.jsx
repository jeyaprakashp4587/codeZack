import React, {useEffect} from 'react';
import {useRewardedAd, TestIds} from 'react-native-google-mobile-ads';

const RewardedAdComponent = () => {
  const {
    show: showRewardedAd,
    isLoaded: isRewardedAdLoaded,
    load: loadRewardedAd,
  } = useRewardedAd(
    __DEV__ ? TestIds.REWARDED : '', // Use test ad unit ID in development
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  // Load the rewarded ad when the component mounts
  useEffect(() => {
    loadRewardedAd();
  }, [loadRewardedAd]);

  return {showRewardedAd, isRewardedAdLoaded};
};

export default RewardedAdComponent;
