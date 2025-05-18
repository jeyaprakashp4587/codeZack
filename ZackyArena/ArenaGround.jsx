import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';

const ArenaGround = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        backgroundColor: Colors.veryDarkGrey,
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
      }}>
      <Text>ArenaGround</Text>
    </View>
  );
};

export default ArenaGround;

const styles = StyleSheet.create({});
