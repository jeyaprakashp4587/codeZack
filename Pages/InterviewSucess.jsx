import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {useData} from '../Context/Contexter';
import {Font} from '../constants/Font';
const {width, height} = Dimensions.get('window');
const InterviewSucess = () => {
  const {selectedCompany} = useData();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FastImage
        source={{
          uri: 'https://i.ibb.co/hJQwxwfh/22908886-6736639.jpg',
          priority: FastImage.priority.high,
        }}
        resizeMode="contain"
        style={{width: 200, aspectRatio: 1}}
      />
      <Text
        style={{
          fontFamily: Font.Regular,
          fontSize: width * 0.038,
          letterSpacing: 0.4,
          textAlign: 'center',
        }}>
        Your are completed {selectedCompany?.company_name} preparation.
      </Text>
    </View>
  );
};

export default InterviewSucess;

const styles = StyleSheet.create({});
