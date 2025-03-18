import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';

const UpdatePage = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
      }}>
      <FastImage
        source={{
          uri: 'https://i.ibb.co/vxpbhNwT/209070594-10732665.jpg',
          priority: FastImage.priority.high,
        }}
        resizeMode="contain"
        style={{width: width * 0.45, aspectRatio: 1}}
      />
      <Text
        style={{
          fontSize: width * 0.045,
          fontFamily: Font.SemiBold,
          letterSpacing: 0.6,
          lineHeight: 30,
          textAlign: 'center',
        }}>
        A new version of the app is available. Please update to continue.
      </Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.codezack',
          );
        }}
        style={{
          //   borderWidth: 0.5,
          width: '90%',
          padding: 10,
          borderRadius: 25,
          backgroundColor: Colors.violet,
        }}>
        <Text
          style={{
            fontFamily: Font.Medium,
            textAlign: 'center',
            letterSpacing: 0.6,
            color: 'white',
          }}>
          Update
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdatePage;

const styles = StyleSheet.create({});
