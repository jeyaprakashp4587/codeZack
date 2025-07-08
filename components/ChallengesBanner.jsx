import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const ChallengesBanner = () => {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [showBanner, setShowBanner] = useState(false);
  const {height} = Dimensions.get('window');

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
      setShowBanner(false);
    } catch (error) {
      console.error('Error setting clicked count:', error);
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <View style={{paddingHorizontal: 15}}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.041,
          letterSpacing: 0.25,
          marginBottom: 10,
        }}>
        Explore real world projects
      </Text>
      <ImageBackground
        source={{
          uri: 'https://i.ibb.co/0pZcxPVQ/2150040428.jpg',
        }}
        style={{borderRadius: 5, overflow: 'hidden', elevation: 2}}
        resizeMode="cover">
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0)',
            'rgba(255, 255, 255, 0.88)',
            'rgba(255, 255, 255, 0.75)',
            'rgba(255, 255, 255, 2)',
          ]}
          style={{height: height * 0.2}}></LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default ChallengesBanner;
