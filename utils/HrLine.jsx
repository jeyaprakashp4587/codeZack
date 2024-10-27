import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '../constants/Colors';

const HrLine = props => {
  return (
    <View
      style={{
        width: props.width ? props.width : '90%',
        borderColor: Colors.veryLightGrey,
        height: 1,
        borderBottomWidth: 1,
        alignSelf: 'center',
        marginVertical: props.margin ? props.margin : 20,
      }}
    />
  );
};

export default HrLine;

const styles = StyleSheet.create({});
