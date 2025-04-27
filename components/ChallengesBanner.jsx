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
  useEffect(() => {
    const fetchClickedCount = async () => {
      try {
        const clickedcount = await AsyncStorage.getItem('clickedcount');
        {
          clickedcount === 'counted' ? null : (
            <View
              style={{
                marginHorizontal: 15,
                padding: 10,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                elevation: 2,
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
                    fontSize: width * 0.04,
                    fontFamily: Font.Medium,
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
                    borderRadius: 20,
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
        }
      } catch (error) {
        console.error('Error fetching clicked count:', error);
      }
    };
    fetchClickedCount();
  }, []);
};

export default ChallengesBanner;
