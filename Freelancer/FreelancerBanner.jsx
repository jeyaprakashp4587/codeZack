import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';
import {useNavigation} from '@react-navigation/native';

const FreelancerBanner = () => {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingHorizontal: 15,
        borderWidth: 0,
        borderColor: Colors.lightGrey,
        marginVertical: 15,
      }}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.045,
          letterSpacing: 0.26,
          marginBottom: 10,
        }}>
        Freelancing
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: 30,
          backgroundColor: Colors.white,
          padding: 10,
          //   borderRadius: 14,
          elevation: 2,
        }}>
        <FastImage
          source={{
            uri: 'https://i.ibb.co/bMsNhktm/11879394-Work-from-home.jpg',
            priority: FastImage.priority.high,
          }}
          resizeMode="contain"
          style={{width: width * 0.35, aspectRatio: 1, zIndex: -10}}
        />
        <View style={{flex: 1, borderWidth: 0, rowGap: 10}}>
          <Text
            style={{
              fontFamily: Font.SemiBold,
              fontSize: width * 0.044,
              letterSpacing: 0.2,
            }}>
            Get paid for your coding skills.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProjectPost')}
            style={{
              backgroundColor: Colors.violet,
              padding: 8,
              borderRadius: 90,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Font.Regular,
                fontSize: width * 0.03,
                textAlign: 'center',
                letterSpacing: 0.3,
              }}>
              Start now →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FreelancerBanner;

const styles = StyleSheet.create({});
