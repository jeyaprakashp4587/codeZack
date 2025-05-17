import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {Font} from '../constants/Font';

const HeadingText = props => {
  const {width} = Dimensions.get('window');
  const nav = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        columnGap: 15,
        // paddingHorizontal: 15,
      }}>
      <TouchableOpacity onPress={() => nav.goBack()}>
        <AntDesign name="arrowleft" size={20} />
      </TouchableOpacity>
      <Text
        style={{
          color: props.color ?? 'black',
          fontSize: width * 0.045,
          paddingVertical: 10,
          letterSpacing: 0.3,
          fontFamily: Font.SemiBold,
        }}
        allowFontScaling={false}>
        {props.text}{' '}
      </Text>
    </View>
  );
};

export default HeadingText;

const styles = StyleSheet.create({});
