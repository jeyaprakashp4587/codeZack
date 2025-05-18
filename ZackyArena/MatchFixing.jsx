import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, font} from '../constants/Colors';
import {Font} from '../constants/Font';
import FastImage from 'react-native-fast-image';

const MatchFixing = () => {
  const {width, height} = Dimensions.get('window');
  // finding opponent steps and states
  const [findingOpponent, setFindingOpponent] = useState(false);
  const [opponent, setOpponent] = useState();
  const findOpponent = useCallback(() => {
    setTimeout(() => {
      setFindingOpponent(true);
    }, 2000);
  }, []);
  // getting arena question from server and states
  const [gettingQuestions, setGettingRandomQuestions] = useState(false);
  useEffect(() => {
    findOpponent();
  }, []);
  return (
    <View
      style={{
        backgroundColor: Colors.veryDarkGrey,
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        rowGap: 10,
      }}>
      <View>
        <Text
          style={{
            fontFamily: Font.SemiBold,
            color: 'rgb(65, 144, 209)',
            fontSize: width * 0.14,
            textAlign: 'center',
          }}>
          Zacky
        </Text>
        <Text
          style={{
            fontFamily: Font.Medium,
            color: Colors.white,
            fontSize: width * 0.06,
            textAlign: 'center',
            letterSpacing: 0.4,
          }}>
          Match Making
        </Text>
      </View>
      {/* list players */}
      <View
        style={{
          //   borderWidth: 1,
          borderColor: 'white',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        {/* player 1 */}
        <View
          style={{
            // borderWidth: 1,
            borderColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Font.SemiBold,
              fontSize: width * 0.08,
              color: Colors.white,
            }}>
            You
          </Text>
          <FastImage
            priority={FastImage.priority.high}
            source={{
              uri: 'https://i.ibb.co/3mCcQp9/woman.png',
            }}
            resizeMode="contain"
            style={{width: width * 0.3, aspectRatio: 1, borderRadius: 100}}
          />
          <Text
            style={{
              fontFamily: Font.Medium,
              color: Colors.white,
              textAlign: 'center',
              fontSize: width * 0.035,
            }}>
            Jeya
          </Text>
        </View>
        {/* player 2 */}
        <View
          style={{
            // borderWidth: 1,
            borderColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Font.SemiBold,
              fontSize: width * 0.08,
              color: Colors.white,
            }}>
            Opnt
          </Text>
          {!findingOpponent ? (
            <ActivityIndicator color={Colors.white} size={width * 0.2} />
          ) : (
            <FastImage
              priority={FastImage.priority.high}
              source={{
                uri: 'https://i.ibb.co/3mCcQp9/woman.png',
              }}
              resizeMode="contain"
              style={{width: width * 0.3, aspectRatio: 1, borderRadius: 100}}
            />
          )}
          <Text
            style={{
              fontFamily: Font.Medium,
              color: Colors.white,
              textAlign: 'center',
              fontSize: width * 0.035,
            }}>
            {!findingOpponent ? 'Finding Opponent' : 'Jeya'}
          </Text>
        </View>
      </View>
      {/* Indicate get question loader */}
      <View style={{rowGap: 10}}>
        <Text
          style={{
            textAlign: 'center',
            color: Colors.white,
            fontFamily: Font.SemiBold,
            letterSpacing: 0.3,
          }}>
          {!gettingQuestions ? 'Getting Question...' : ' '}
        </Text>
        {!gettingQuestions && (
          <ActivityIndicator size={40} color={Colors.white} />
        )}
      </View>
    </View>
  );
};

export default MatchFixing;

const styles = StyleSheet.create({});
