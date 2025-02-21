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

const HeadingText = props => {
  const {widht} = Dimensions.get('window');
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
          fontSize: 20,
          paddingVertical: 10,
          letterSpacing: 1,
        }}
        allowFontScaling={false}>
        {props.text}{' '}
      </Text>
    </View>
  );
};

export default HeadingText;

const styles = StyleSheet.create({});
