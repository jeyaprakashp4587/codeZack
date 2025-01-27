import {useEffect, useCallback} from 'react';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';

const useInterstitialAdHook = () => {
  const {
    show: showInterstitialAd,
    isLoaded: isInterstitialAdLoaded,
    load: loadInterstitialAd,
  } = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : '<YOUR_AD_UNIT_ID>', // Replace with your production ad unit ID
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );

  // Load the interstitial ad when the hook is initialized
  useEffect(() => {
    loadInterstitialAd();
  }, [loadInterstitialAd]);

  // Automatically reload the ad after it is shown and closed
  useEffect(() => {
    if (!isInterstitialAdLoaded) {
      loadInterstitialAd();
    }
  }, [isInterstitialAdLoaded, loadInterstitialAd]);

  // Safely show the interstitial ad
  const handleShowInterstitialAd = useCallback(() => {
    if (isInterstitialAdLoaded) {
      showInterstitialAd();
    }
  }, [isInterstitialAdLoaded, showInterstitialAd]);

  return {
    showInterstitialAd: handleShowInterstitialAd,
    isInterstitialAdLoaded,
  };
};

export default useInterstitialAdHook;
