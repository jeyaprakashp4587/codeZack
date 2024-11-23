import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
const Tasks = () => {
  return (
    <View style={{paddingHorizontal: 15}}>
      <TouchableOpacity>
        <View></View>
        <View>
          <FastImage
            source={{
              uri: 'https://i.ibb.co/NVRkkPc/rb-25998.png',
              //   priority: FastImage.priority.normal,
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({});
