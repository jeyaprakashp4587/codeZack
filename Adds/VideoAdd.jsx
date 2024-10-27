import {useEffect, useRef, useState} from 'react';
import {
  RewardedAd,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const VideoAdd = (adUnitId = TestIds.REWARDED) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const rewardedAd = useRef(null);

  useEffect(() => {
    // Create a new rewarded ad instance
    rewardedAd.current = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // Event listeners
    const onAdLoaded = () => {
      setIsLoaded(true);
      console.log('Ad loaded successfully');

      showAd(); // Automatically show ad if the trigger is set
    };

    const onAdEarnedReward = () => {
      console.log('User earned reward!');
    };

    rewardedAd.current.addAdEventListener(
      RewardedAdEventType.LOADED,
      onAdLoaded,
    );

    rewardedAd.current.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      onAdEarnedReward,
    );

    // Initial load
    rewardedAd.current.load();

    // Cleanup listeners on unmount
    return () => {
      rewardedAd.current.removeAllListeners();
      rewardedAd.current = null; // Clear reference
    };
  }, [adUnitId, shouldShowAd]); // Add shouldShowAd to dependencies

  const showAd = () => {
    if (isLoaded && rewardedAd.current) {
      rewardedAd.current.show();
      setShouldShowAd(false); // Reset trigger after showing the ad
    } else {
      console.warn('Ad not loaded yet');
    }
  };

  const triggerShowAd = () => {
    setShouldShowAd(true); // Set trigger to show ad
  };

  return {isLoaded, showAd: triggerShowAd}; // Expose the trigger function
};

export default VideoAdd;
