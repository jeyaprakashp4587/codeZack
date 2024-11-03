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

  // State to manage impressions and timing
  const [impressionCount, setImpressionCount] = useState(0);
  const [firstImpressionTime, setFirstImpressionTime] = useState(null);

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
        loadAd();
        setIsLoaded(false);
      },
    );
    loadAd();
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [interstitialAd]);

  const showAd = async () => {
    const currentTime = new Date().getTime();

    // Reset count if more than 1 minute has passed since the first impression
    if (firstImpressionTime && currentTime - firstImpressionTime > 60000) {
      console.log('Resetting impression count');
      setImpressionCount(0);
      setFirstImpressionTime(null); // Reset the time as well
    }

    // Show the ad if under the limit
    if (isLoaded && impressionCount < 5) {
      // Change to 10 for your requirement
      // console.log(`Showing ad - Current Count: ${impressionCount + 1}`);
      await interstitialAd.show();
      setImpressionCount(prevCount => {
        if (prevCount === 0) {
          setFirstImpressionTime(currentTime); // Set the first impression time
        }
        return prevCount + 1; // Increment the count
      });
      loadAd(); // Load a new ad after showing
    } else {
      // console.log('Ad limit reached or not loaded');
    }
  };

  return {showAd, loadAd, isLoaded};
};

export default useInterstitialAd;
