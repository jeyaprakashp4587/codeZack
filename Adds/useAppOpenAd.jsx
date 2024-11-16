import {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {AppOpenAd, TestIds, AdEventType} from 'react-native-google-mobile-ads';

const useAppOpenAd = () => {
  const adUnitId = __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-3257747925516984/6520210341';
  const [adLoaded, setAdLoaded] = useState(false);
  let appOpenAd;
  appOpenAd = AppOpenAd.createForAdRequest(adUnitId);
  useEffect(() => {
    const onAdLoaded = () => {
      setAdLoaded(true);
    };
    const onAdError = error => {
      console.error('Error loading App Open Ad:', error);
      setAdLoaded(false);
    };
    appOpenAd.addAdEventListener(AdEventType.LOADED, onAdLoaded);
    appOpenAd.addAdEventListener(AdEventType.ERROR, onAdError);
    appOpenAd.load();
    const handleAppStateChange = async nextAppState => {
      if (nextAppState === 'active' && adLoaded) {
        // console.log(nextAppState);
        try {
          await appOpenAd.show();
          setAdLoaded(false);
          appOpenAd.load();
        } catch (error) {
          console.error('Error showing App Open Ad:', error);
        }
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      appOpenAd.removeAllListeners();
      subscription.remove();
    };
  }, [adLoaded]);

  return null;
};

export default useAppOpenAd;
