import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const PasswordReset = () => {
  const {width} = Dimensions.get('window');
  const [email, setEmail] = useState('');
  const nav = useNavigation();
  const isEmailValid = email => /\S+@\S+\.\S+/.test(email);
  // Update the email ref
  const handleEmail = text => {
    setEmail(text);
  };
  // Handle sending OTP
  const sendOtp = useCallback(async () => {
    // console.log(email);
    if (!isEmailValid(email.trim())) {
      ToastAndroid.show('Invalid email format.', ToastAndroid.SHORT);
      return false;
    }
    try {
      nav.navigate('otpVerification');
    } catch (error) {
      console.log(error);
    }
  }, [email]);
  //
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
          //   rowGap: 10,
        }}>
        <MaterialIcons name="fingerprint" size={60} color={Colors.lightGrey} />
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 2,
            fontWeight: '600',
            fontSize: width * 0.053,
            width: '100%',
            textAlign: 'center',
            marginBottom: 20,
          }}>
          Forgot Password?
        </Text>
        <Text
          style={{
            fontSize: width * 0.03,
            color: Colors.mildGrey,
            letterSpacing: 1,
            width: '100%',
            marginBottom: 20,
          }}>
          No worries, we'll send you reset instructions.
        </Text>
        <Text
          style={{textAlign: 'left', width: '100%', color: Colors.mildGrey}}>
          Email
        </Text>
        <TextInput
          placeholder="Enter your email"
          style={{
            borderWidth: 0.6,
            borderColor: Colors.lightGrey,
            borderRadius: 5,
            width: '100%',
            paddingHorizontal: 10,
            marginBottom: 20,
          }}
          onChangeText={text => handleEmail(text)}
        />
        <TouchableOpacity
          onPress={() => sendOtp()}
          style={{
            backgroundColor: Colors.violet,
            width: '100%',
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Send OTP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
            marginBottom: 20,
          }}>
          <AntDesign name="arrowleft" size={20} color={Colors.lightGrey} />
          <Text style={{color: Colors.lightGrey}}>Back To Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordReset;

const styles = StyleSheet.create({});
