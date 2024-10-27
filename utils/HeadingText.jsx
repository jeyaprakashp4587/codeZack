import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '../constants/Colors';

const HeadingText = props => {
  return (
    <Text
      style={{
        color: Colors.mildGrey,
        fontSize: 25,
        paddingVertical: 10,
        letterSpacing: 1,
      }}>
      {props.text}
    </Text>
  );
};

export default HeadingText;

const styles = StyleSheet.create({});
