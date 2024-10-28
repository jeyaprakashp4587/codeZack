import {useCallback, useEffect, useRef, useState} from 'react';
import {
  RewardedAd,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const VideoAdd = (adUnitId = TestIds.REWARDED) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCredited, setIsCredited] = useState(false);
  const rewardedAd = useRef(null);

  useEffect(() => {
    // Create a new rewarded ad instance
    rewardedAd.current = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // Event listeners
    const onAdLoaded = () => {
      setIsLoaded(true);
      setIsCredited(false);
      console.log('Ad loaded successfully');
    };

    const onAdEarnedReward = () => {
      console.log('User earned reward!');
      setIsCredited(true);
      rewardedAd.current.load();
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
  }, [adUnitId]);

  useEffect(() => {
    // Reload ad when user has earned a reward
    if (isCredited) {
      rewardedAd.current?.load();
      setIsLoaded(false); // Reset state for the next ad
    }
  }, [isCredited]);

  const showAd = useCallback(() => {
    if (isLoaded && rewardedAd.current) {
      rewardedAd.current.show();
      setIsLoaded(false); // Reset to reload the ad after showing
    }
  }, [isLoaded]);

  return {isLoaded, showAd, isCredited};
};

export default VideoAdd;
