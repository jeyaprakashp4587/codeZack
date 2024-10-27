import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '../constants/Colors';

const TopicsText = props => {
  return (
    <Text
      style={{
        fontSize: props.fszie ? props.fszie : 23,
        color: Colors.mildGrey,
        marginBottom: props.mb ? props.mb : 20,
        letterSpacing: 1,
      }}>
      {props.text}
    </Text>
  );
};

export default TopicsText;

const styles = StyleSheet.create({});
