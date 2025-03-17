import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';

const ChallengesBanner = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: 'white',
        paddingHorizontal: 20,
      }}>
      <View
        style={{flex: 1, borderWidth: 0, flexDirection: 'column', rowGap: 10}}>
        <Text
          style={{
            // width: '45%',
            fontSize: width * 0.04,
            fontFamily: Font.Medium,
            lineHeight: 25,
            letterSpacing: 0.2,
          }}>
          Get More Web & App Challenges
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 0.8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            width: '70%',
          }}>
          <Text
            style={{
              fontFamily: Font.Regular,
              letterSpacing: 0.6,
              fontSize: width * 0.033,
              padding: 5,
              textAlign: 'center',
              color: Colors.violet,
              // fontWeight: '700',
            }}>
            Explore
          </Text>
        </TouchableOpacity>
      </View>
      <FastImage
        source={{
          uri: 'https://i.ibb.co/Z6gZmMZ2/12083375-Wavy-Bus-20-Single-04.jpg',
          priority: FastImage.priority.high,
        }}
        style={{width: 120, aspectRatio: 1}}
        resizeMode="contain"
      />
    </View>
  );
};

export default ChallengesBanner;
