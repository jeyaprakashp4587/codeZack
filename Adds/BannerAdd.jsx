import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdd = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(true), 1000); // 1-second delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.bannerContainer}>
      {showBanner ? (
        <BannerAd
          unitId={
            __DEV__ ? TestIds.BANNER : 'ca-app-pub-3257747925516984/6510098916'
          }
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          // onAdFailedToLoad={error =>
          //   // console.log('Banner Ad Failed to Load:', error)
          // }
          // onAdLoaded={() => console.log('Banner Ad Loaded Successfully')}
        />
      ) : (
        <Text>Loading Banner...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 10,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default BannerAdd;
