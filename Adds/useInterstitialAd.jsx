// useInterstitialAd.js
import {useEffect, useState} from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const useInterstitialAd = () => {
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-3257747925516984/7944220654';
  const [isLoaded, setIsLoaded] = useState(false);
  const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

  const loadAd = () => {
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
      },
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoaded(false);
        loadAd(); // Load a new ad after it is closed
      },
    );

    loadAd();
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [interstitialAd]);

  const showAd = async () => {
    if (isLoaded) {
      try {
        await interstitialAd.show();
        loadAd();
        return {success: true, message: 'Ad shown successfully'};
      } catch (error) {
        return {
          success: false,
          message: 'Failed to show add , try again',
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
