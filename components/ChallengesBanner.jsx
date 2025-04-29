import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChallengesBanner = () => {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchClickedCount = async () => {
      try {
        const clickedcount = await AsyncStorage.getItem('clickedcount');
        if (clickedcount !== 'counted') {
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error fetching clicked count:', error);
      }
    };
    fetchClickedCount();
  }, []);

  const handleExplorePress = async () => {
    try {
      navigation.navigate('Code');
      await AsyncStorage.setItem('clickedcount', 'counted');
      setShowBanner(false); // Hide the banner after clicking
    } catch (error) {
      console.error('Error setting clicked count:', error);
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <View
      style={{
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        paddingHorizontal: 20,
        marginVertical: 15,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          borderWidth: 0,
          flexDirection: 'column',
          rowGap: 10,
        }}>
        <Text
          style={{
            // width: '45%',
            fontSize: width * 0.043,
            fontFamily: Font.SemiBold,
            lineHeight: 25,
            letterSpacing: 0.3,
          }}>
          Get More Web & App Challenges
        </Text>
        <TouchableOpacity
          onPress={async () => {
            naviagte.navigate('Code');
            await AsyncStorage.setItem('clickedcount', 'counted');
          }}
          style={{
            // borderWidth: 0.8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            width: '70%',
            borderColor: Colors.violet,
            backgroundColor: Colors.violet,
          }}>
          <Text
            style={{
              fontFamily: Font.Medium,
              letterSpacing: 0.6,
              fontSize: width * 0.033,
              padding: 7,
              textAlign: 'center',
              color: Colors.white,
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
        style={{width: width * 0.35, aspectRatio: 1}}
        resizeMode="contain"
      />
    </View>
  );
};

export default ChallengesBanner;
