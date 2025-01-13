import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {Colors, font} from '../constants/Colors';
import Ripple from 'react-native-material-ripple';

const Button = props => {
  return (
    <Ripple
      rippleOpacity={0.6}
      onPressIn={props.function}
      onPress={props.function}
      style={{
        // borderWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: props.radius ? props.radius : 5,
        backgroundColor: props.bgcolor ? props.bgcolor : Colors.veryLightGrey,
        // backgroundColor: "t"
        elevation: props.elevation ? props.elevation : 2,
        width: props.width ? props.width : 'auto',
        alignSelf: 'center',
        marginBottom: props.mb ?? 0,
      }}>
      <Text
        style={{
          // fontFamily: font.poppins,
          fontSize: props.fsize ? props.fsize : 15,
          color: props.textColor ? props.textColor : 'black',
          fontWeight: props.fweight ? props.fweight : '400',
          letterSpacing: 1,
        }}>
        {props.text}
      </Text>
    </Ripple>
  );
};

export default Button;

const styles = StyleSheet.create({});
