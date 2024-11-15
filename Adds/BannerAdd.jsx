import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdd = () => {
  return (
    <View
      style={{
        marginTop: 10,
        borderWidth: 0,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <BannerAd
        unitId={
          __DEV__ ? TestIds.BANNER : 'ca-app-pub-3257747925516984/6510098916'
        }
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={error =>
          console.log('Banner Ad Failed to Load:', error)
        }
        onAdLoaded={() => console.log('Banner Ad Loaded Successfully')}
      />
    </View>
  );
};

export default BannerAdd;

const styles = StyleSheet.create({});
