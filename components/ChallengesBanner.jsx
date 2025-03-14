import {Dimensions, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';

const ChallengesBanner = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        // borderWidth: 1,
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: 'white',
        paddingHorizontal: 20,
      }}>
      <Text
        style={{
          width: '45%',
          fontSize: width * 0.04,
          fontFamily: Font.SemiBold,
          lineHeight: 25,
        }}>
        Get More Web & App Challenges
      </Text>
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
