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

  const [isRequesting, setIsRequesting] = useState(false); // State to prevent multiple requests
  const rewardAd = RewardedAd.createForAdRequest(unitId);

  // Load ad function with protection against multiple requests
  const loadAd = () => {
    if (isRequesting) return; // Prevent multiple requests

    setIsRequesting(true); // Set requesting state to true while loading
    rewardAd.load({
      requestNonPersonalizedAdsOnly: true,
    });
  };

  useEffect(() => {
    // Listener for ad loaded
    const loadedListener = rewardAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setIsRequesting(false); // Reset requesting state when the ad is loaded
      },
    );

    // Listener for ad reward earned
    const rewardListener = rewardAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        console.log('Ad Reward Earned');
        loadAd(); // Reload the ad after the reward is earned
      },
    );

    // Load the ad initially
    loadAd();

    return () => {
      // Cleanup listeners when the component unmounts
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
