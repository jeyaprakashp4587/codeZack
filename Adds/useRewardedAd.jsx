import {useEffect, useState} from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const useRewardedAd = () => {
  const unitId = __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-3257747925516984/5831080677';

  const rewardAd = RewardedAd.createForAdRequest(unitId);

  const loadAd = () => {
    rewardAd.load({
      requestNonPersonalizedAdsOnly: true,
    });
    // console.log('trigger to load');
  };

  useEffect(() => {
    // Listener for ad loaded
    const loadedListener = rewardAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        // console.log('Ad Loaded from rewared video add');
      },
    );

    // Listener for ad reward earned
    const rewardListener = rewardAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        console.log('Ad Reward Earned');

        loadAd(); // Reload ad
      },
    );

    // Load the ad initially
    loadAd();

    return () => {
      // Clean up listeners
      rewardAd.removeAllListeners();
      loadedListener();
      rewardListener();
    };
  }, []);

  const showRewardAd = async () => {
    if (rewardAd.loaded) {
      try {
        console.log('ready to show');
        await rewardAd.show();

        return {success: true, message: 'Ad shown successfully'};
      } catch (error) {
        console.error('Error showing ad:', error);
        return {success: false, message: 'Error showing ad'};
      }
    } else {
      return {success: false, message: 'Ad not loaded yet'};
    }
  };

  return {showRewardAd};
};

export default useRewardedAd;
