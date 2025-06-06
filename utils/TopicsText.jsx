import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';

const TopicsText = props => {
  return (
    <Text
      style={{
        fontSize: props.fszie ? props.fszie : 23,
        color: props.color ?? Colors.mildGrey,
        marginBottom: props.mb ? props.mb : 20,
        letterSpacing: props.lp ? props.lp : 1,
        // fontWeight: props.fontWeight ?? '400',
        lineHeight: props.ln && props.ln,
        fontFamily: Font.SemiBold,
      }}>
      {props.text}
    </Text>
  );
};

export default TopicsText;

const styles = StyleSheet.create({});
