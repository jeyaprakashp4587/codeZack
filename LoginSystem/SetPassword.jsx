import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import {Colors} from '../constants/Colors';

const SetPassword = () => {
  const {width} = Dimensions.get('window');
  const {email} = useRoute().params;
  console.log(email);

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          borderWidth: 1,
          borderColor: 'white',
          width: '80%',
          rowGap: 10,
        }}>
        <MaterialIcons name="password" size={40} color={Colors.lightGrey} />
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 2,
            fontWeight: '600',
            fontSize: width * 0.053,
            width: '100%',
            textAlign: 'center',
            marginBottom: 10,
          }}>
          Set new password
        </Text>
        <Text
          style={{
            letterSpacing: 1,
            color: Colors.mildGrey,
            fontSize: width * 0.03,
          }}>
          Must be atleast 6 characters
        </Text>
        <View style={{width: '100%'}}>
          <Text
            style={{textAlign: 'left', width: '100%', color: Colors.mildGrey}}>
            Password
          </Text>
          <TextInput
            placeholder="password"
            style={{
              borderWidth: 0.6,
              borderColor: Colors.lightGrey,
              borderRadius: 5,
              width: '100%',
              paddingHorizontal: 10,
              marginBottom: 20,
            }}
            // onChangeText={text => handleEmail(text)}
          />
        </View>
        <View style={{width: '100%'}}>
          <Text
            style={{textAlign: 'left', width: '100%', color: Colors.mildGrey}}>
            Confirm Password
          </Text>
          <TextInput
            placeholder="confirm password"
            style={{
              borderWidth: 0.6,
              borderColor: Colors.lightGrey,
              borderRadius: 5,
              width: '100%',
              paddingHorizontal: 10,
              marginBottom: 20,
            }}
            // onChangeText={text => handleEmail(text)}
          />
        </View>
        <TouchableOpacity
          // onPress={() => sendOtp()}
          style={{
            backgroundColor: Colors.violet,
            width: '100%',
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetPassword;

const styles = StyleSheet.create({});
