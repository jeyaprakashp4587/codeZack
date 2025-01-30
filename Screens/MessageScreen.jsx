import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import FastImage from 'react-native-fast-image';
import HeadingText from '../utils/HeadingText';
// import useNotificationsHook from "../Notification/NotificationsHook";

const MessageScreen = () => {
  const {width, height} = Dimensions.get('window');
  const {user} = useData();
  // const { sendLocalNotification } = useNotificationsHook();
  useEffect(() => {
    // sendLocalNotification({ text: "hii" });
  }, []);
  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Messages" />
      </View>
      <View
        style={{
          // borderWidth: 1,
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 20,
        }}>
        <FastImage
          source={{
            uri: 'https://i.ibb.co/RG6KVC9z/4167292-18787.jpg',
            priority: FastImage.priority.high,
          }}
          resizeMode="contain"
          style={{width: width * 0.6, aspectRatio: 1, borderRadius: 100}}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: width * 0.05,
            letterSpacing: 1,
          }}>
          Under Working!
        </Text>
      </View>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({});
