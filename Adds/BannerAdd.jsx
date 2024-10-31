import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdd = () => {
  return (
    <View style={{marginTop: 10}}>
      <BannerAd
        unitId={
          __DEV__ ? TestIds.BANNER : 'ca-app-pub-3257747925516984/5222339498'
        }
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default BannerAdd;

const styles = StyleSheet.create({});
