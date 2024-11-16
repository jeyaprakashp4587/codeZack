import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdd = () => {
  const bannerId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-3257747925516984/6303091060';
  const [addInfo, setAddInfo] = useState();
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={bannerId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          // console.log('Banner Ad Loaded');
          setAddInfo('Banner Ad Loaded');
        }}
        onAdFailedToLoad={error => {
          // console.error('Banner Ad Failed to Load:', error);
          setAddInfo('Banner Ad Failed to Load:', error);
        }}
      />
      <Text>{addInfo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BannerAdd;
