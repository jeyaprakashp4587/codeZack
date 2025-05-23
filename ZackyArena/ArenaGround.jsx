import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';
import Skeleton from '../Skeletons/Skeleton';
import TypingEffectDots from '../utils/TypingEffectDots';

const ArenaGround = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        backgroundColor: Colors.veryDarkGrey,
        flex: 1,
        paddingHorizontal: 20,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // rowGap: 10,
      }}>
      {/* arena header */}
      <View
        style={{
          flexDirection: 'row',
          // borderWidth: 1,
          borderColor: 'red',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Text
          style={{
            fontFamily: Font.SemiBold,
            color: 'rgb(65, 144, 209)',
            fontSize: width * 0.13,
            textAlign: 'center',
          }}>
          Zacky
        </Text>
        {/* show opponent */}
        <View
          style={{
            // borderWidth: 1,
            // borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
          <FastImage
            priority={FastImage.priority.high}
            source={{
              uri: 'https://i.ibb.co/3mCcQp9/woman.png',
            }}
            resizeMode="contain"
            style={{width: width * 0.13, aspectRatio: 1, borderRadius: 100}}
          />
          <TypingEffectDots />
        </View>
        {/* <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: Colors.white,
            borderRadius: 10,
            width: '30%',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Font.Medium,
              fontSize: width * 0.035,
            }}>
            exit
          </Text>
        </TouchableOpacity> */}
      </View>
      {/* show questions */}
      <View style={{borderWidth: 0, borderColor: 'red'}}>
        <Text
          style={{
            color: Colors.white,
            fontFamily: Font.Medium,
            fontSize: width * 0.05,
          }}>
          Question: 1
        </Text>
        <Text
          style={{
            color: Colors.white,
            fontFamily: Font.SemiBold,
            fontSize: width * 0.04,
          }}>
          Create a Palindrome Program
        </Text>
        <Text
          style={{
            color: Colors.white,
            fontFamily: Font.Regular,
            fontSize: width * 0.033,
          }}>
          Input: "MADAM"
        </Text>
        <Text
          style={{
            color: Colors.white,
            fontFamily: Font.Regular,
            fontSize: width * 0.033,
          }}>
          Outpus: "MADAM is a Palindrome"
        </Text>
      </View>
    </View>
  );
};

export default ArenaGround;

const styles = StyleSheet.create({});
