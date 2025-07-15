import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../../constants/Font';
import {Colors} from '../../constants/Colors';
import {useNavigation} from '@react-navigation/native';

const LeaderBoardBanner = () => {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingHorizontal: 15,
        overflow: 'hidden',
      }}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.041,
          marginBottom: 10,
          letterSpacing: 0.25,
        }}>
        Leaderboard
      </Text>
      <View
        style={{
          backgroundColor: '#DFEBE9',
          // borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          borderRadius: 10,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            padding: 15,
            rowGap: 5,
            width: '55%',
            overflow: 'hidden',
            // borderWidth: 1,
          }}>
          <Text
            style={{
              fontFamily: Font.SemiBold,
              fontSize: width * 0.04,
              color: 'rgba(0, 0, 0, 0.94)',
              lineHeight: 18,
            }}>
            Top the board. Build your legacy
          </Text>
          <Text
            style={{
              fontFamily: Font.Regular,
              fontSize: width * 0.028,
              color: 'rgba(39, 39, 41, 0.87)',
              lineHeight: 17,
            }}>
            Rank up on the leaderboard, and unlock your personalized portfolio
            as a reward! 🚀
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('leaderBoard')}
            style={{
              backgroundColor: Colors.violet,
              // height: height * 0.03,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
              width: '70%',
            }}>
            <Text
              style={{
                padding: 5,
                color: Colors.white,
                fontFamily: Font.Regular,
                fontSize: width * 0.035,
              }}>
              Climb now
            </Text>
          </TouchableOpacity>
        </View>
        <FastImage
          resizeMode="cover"
          style={{
            width: width * 0.5,
            aspectRatio: 1,
            position: 'absolute',
            bottom: -35,
            right: 0,
            // borderWidth: 1,
          }}
          source={{
            uri: 'https://i.ibb.co/xSfLyCDD/Adobe-Express-file.png',
            priority: FastImage.priority.high,
          }}
        />
      </View>
    </View>
  );
};

export default LeaderBoardBanner;

const styles = StyleSheet.create({});
