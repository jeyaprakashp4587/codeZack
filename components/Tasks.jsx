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
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const Tasks = () => {
  const navigation = useNavigation();
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
            rowGap: height * 0.02,
          }}>
          <Text
            style={{
              lineHeight: 25,
              letterSpacing: 2,
              fontSize: width * 0.042,
            }}>
            Complete Tasks and get Money
          </Text>
          {/* button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('taskScreen')}
            style={{
              // backgroundColor: Colors.violet,
              padding: width * 0.02,
              paddingHorizontal: width * 0.05,
              borderRadius: 60,
              borderWidth: 0.7,
              borderColor: Colors.mildGrey,
            }}>
            <Text style={{letterSpacing: 2, fontSize: width * 0.03}}>
              Try it out!
            </Text>
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
