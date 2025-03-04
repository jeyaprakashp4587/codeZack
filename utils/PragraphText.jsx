import React from 'react';
import {View, Text} from 'react-native';

import {Colors} from '../constants/Colors';

const PragraphText = props => {
  return (
    <Text
      style={{
        color: props.color ? props.color : Colors.mildGrey,
        fontSize: props.fsize ? props.fsize : 16,
        lineHeight: 30,
        letterSpacing: 1,
        paddingVertical: props.padding ? props.padding : 10,
        width: props.widht ? props.widht : 'auto',
        // fontWeight: props.fweight ?? '400',
        fontFamily: 'Poppins-Medium',
      }}>
      {props.text}
    </Text>
  );
};

export default PragraphText;
