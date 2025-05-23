import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdd = () => {
  const bannerId = __DEV__
    ? TestIds.BANNER // Use test ad unit in development
    : 'ca-app-pub-3257747925516984/6972244634'; // Use your AdMob unit ID in production

  const [adInfo, setAdInfo] = useState('');

  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={bannerId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        // onAdLoaded={() => setAdInfo('Ad Loaded Successfully')}
        // onAdFailedToLoad={error =>
        // setAdInfo(`Ad Load Failed: ${error.message}`)
        // }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 5,
  },
});

export default BannerAdd;
