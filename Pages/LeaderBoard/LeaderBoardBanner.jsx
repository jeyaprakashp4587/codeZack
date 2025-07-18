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
import useMonthlyCountdown from '../../hooks/useMonthlyCountdown';

const LeaderBoardBanner = () => {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();
  const {days, mins, secs, hours} = useMonthlyCountdown();
  return (
    <View
      style={{
        paddingHorizontal: 15,
        overflow: 'hidden',
        position: 'relative',
      }}>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.041,
          marginBottom: 10,
          letterSpacing: 0.25,
        }}>
        Get free portfolio
      </Text>
      <View
        style={{
          backgroundColor: '#DFEBE9',
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
          }}>
          <Text
            style={{
              fontFamily: Font.SemiBold,
              fontSize: width * 0.05,
              color: 'rgba(0, 0, 0, 0.94)',
              lineHeight: 24,
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
            Rank up on the leaderboard, and unlock your personalized rewards! 🚀
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('leaderBoard')}
            style={{
              backgroundColor: Colors.violet,
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
                fontSize: width * 0.032,
              }}>
              Climb now
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.78)',
            color: 'rgb(0,0,0)',
            fontFamily: Font.Medium,
            fontSize: width * 0.027,
            padding: 5,
            borderRadius: 100,
            paddingHorizontal: 10,
            minWidth: 2,
            top: 15,
            right: 15,
            zIndex: 100,
          }}>
          Days left: {days}:{hours}:{mins}:{secs}
        </Text>
        <FastImage
          resizeMode="cover"
          style={{
            width: width * 0.5,
            aspectRatio: 1,
            position: 'absolute',
            bottom: -35,
            right: 0,
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
