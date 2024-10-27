import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
// import useNotificationsHook from "../Notification/NotificationsHook";

const MessageScreen = () => {
  const {user} = useData();
  // const { sendLocalNotification } = useNotificationsHook();
  useEffect(() => {
    // sendLocalNotification({ text: "hii" });
  }, []);
  return (
    <View style={pageView}>
      <Text>Under Working!</Text>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({});
