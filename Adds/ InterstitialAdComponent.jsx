import React, {useEffect} from 'react';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';

const InterstitialAdComponent = () => {
  const {
    show: showInterstitialAd,
    isLoaded: isInterstitialAdLoaded,
    load: loadInterstitialAd,
  } = useInterstitialAd(__DEV__ ? TestIds.INTERSTITIAL : adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  // Load the ad when the component mounts
  useEffect(() => {
    loadInterstitialAd();
  }, [loadInterstitialAd]);
  // Reload the ad if it is shown and then closed
  useEffect(() => {
    // Listen for the ad being closed
    if (!isInterstitialAdLoaded) {
      loadInterstitialAd();
    }
    return () => {
      // Cleanup if needed (depending on your logic)
    };
  }, [isInterstitialAdLoaded, loadInterstitialAd]);

  return {showInterstitialAd, isInterstitialAdLoaded};
};

export default InterstitialAdComponent;
