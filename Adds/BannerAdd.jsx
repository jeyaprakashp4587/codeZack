import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdd = () => {
  const [isAdLoading, setIsAdLoading] = useState(true);
  const bannerId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-3257747925516984/6303091060';
  useEffect(() => {
    const timer = setTimeout(() => setIsAdLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.bannerContainer}>
      {isAdLoading ? (
        <Text>Loading Banner...</Text>
      ) : (
        <BannerAd
          unitId={bannerId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => setIsAdLoading(false)}
          onAdFailedToLoad={error => {
            console.error('Banner Ad Failed to Load:', error);
            setIsAdLoading(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default BannerAdd;
