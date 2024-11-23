import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '../constants/Colors';
const {width, height} = Dimensions.get('window');
const Tasks = () => {
  return (
    <View style={{paddingHorizontal: 15, marginVertical: 15}}>
      <View
        style={{
          borderWidth: 0,
          height: height * 0.2,
          flexDirection: 'row',
          elevation: 3,
          backgroundColor: 'white',
          borderRadius: 15,
        }}>
        <View
          style={{
            borderWidth: 0,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 15,
            rowGap: 10,
          }}>
          <Text style={{lineHeight: 25, letterSpacing: 1.5}}>
            Complete All Tasks and get Money
          </Text>
          {/* button */}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.violet,
              padding: 5,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}>
            <Text style={{letterSpacing: 2, color: 'white'}}>Try it out!</Text>
          </TouchableOpacity>
        </View>
        <View style={{borderWidth: 0, flex: 1}}>
          <FastImage
            style={{width: '100%', height: '100%'}}
            source={{
              uri: 'https://i.ibb.co/NVRkkPc/rb-25998.png',
              priority: FastImage.priority.normal,
            }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({});
