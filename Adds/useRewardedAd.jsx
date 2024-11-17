import {useEffect, useState, useRef} from 'react';
import {
  RewardedInterstitialAd,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

export const useRewardedAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);

  const rewardedAdUnitId = __DEV__
    ? TestIds.REWARDED_INTERSTITIAL
    : 'ca-app-pub-3257747925516984/2118232229';

  const rewardedAd = useRef(
    RewardedInterstitialAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    }),
  ).current;
  // load ad
  const loadAd = () => {
    console.log('Loading rewarded ad...');
    rewardedAd.load();
  };
  loadAd();
  useEffect(() => {
    // Load the ad and log the steps

    loadAd();

    // Define event listener to handle ad events
    const onAdEvent = type => {
      console.log(`Ad event type: ${type}`);
      if (type === RewardedAdEventType.LOADED) {
        setIsAdLoaded(true);
        console.log('Ad loaded successfully!');
      } else if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reward!');
      }
    };

    // Add event listeners to track ad events
    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Ad is loaded!');
      onAdEvent(RewardedAdEventType.LOADED);
    });
    rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      onAdEvent(RewardedAdEventType.EARNED_REWARD);
    });

    // Cleanup event listeners on unmount
    return () => {
      rewardedAd.removeAllListeners();
    };
  }, [rewardedAd]);

  useEffect(() => {
    // Show the ad after 5 seconds if it's loaded and not showing yet
    const timer = setTimeout(() => {
      if (isAdLoaded && !isAdShowing) {
        setIsAdShowing(true);
        rewardedAd.show().catch(error => {
          console.log('Error showing ad:', error); // Catch any error that happens while showing the ad
        });
        setIsAdShowing(false); // Reset the flag after the ad is shown
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [isAdLoaded, isAdShowing]);

  return {isAdLoaded, isAdShowing};
};
