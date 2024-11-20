import {useEffect, useState} from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const useInterstitialAd = () => {
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-3257747925516984/2804627935';

  const [isLoaded, setIsLoaded] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false); // State to prevent multiple requests
  const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

  const loadAd = () => {
    if (isRequesting) return; // Prevent multiple requests if one is already in progress

    setIsRequesting(true);
    const requestOptions = {
      requestNonPersonalizedAdsOnly: true,
    };
    interstitialAd.load(requestOptions);
  };

  useEffect(() => {
    // Listen for ad events
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setIsLoaded(true);
        setIsRequesting(false); // Reset requesting state when ad is loaded
      },
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoaded(false);
        loadAd(); // Load a new ad after it is closed, but avoid reloading immediately if it's already in progress
      },
    );

    loadAd(); // Initial ad load
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [interstitialAd]);

  const showAd = async () => {
    if (isLoaded) {
      try {
        await interstitialAd.show();
        loadAd(); // Load a new ad only after showing the current one
        return {success: true, message: 'Ad shown successfully'};
      } catch (error) {
        return {
          success: false,
          message: 'Failed to show ad, try again',
          error,
        };
      }
    } else {
      return {success: false, message: 'Ad not loaded yet'};
    }
  };

  return {showAd, loadAd, isLoaded};
};

export default useInterstitialAd;
