import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChallengesBanner = () => {
  const {width, height} = Dimensions.get('window');
  const naviagte = useNavigation();
  const [showBanner, setShowBanner] = useState(true);
  useEffect(() => {
    try {
      const clickedcount = AsyncStorage.getItem('clickcount');
      if (clickedcount) {
        setShowBanner(false);
      }
    } catch (error) {}
  }, []);
  // if (!showBanner) return null;
  return (
    <View
      style={{
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
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
          onPress={async () => {
            naviagte.navigate('Code');
            await AsyncStorage.setItem('clickedcount', 1);
          }}
          style={{
            borderWidth: 0.8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            width: '70%',
            borderColor: Colors.violet,
          }}>
          <Text
            style={{
              fontFamily: Font.Regular,
              letterSpacing: 0.6,
              fontSize: width * 0.033,
              padding: 5,
              textAlign: 'center',
              color: Colors.violet,
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
