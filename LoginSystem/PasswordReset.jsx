import {
  ActivityIndicator,
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
import axios from 'axios';
import {loginApi} from '../Api';
import LinearGradient from 'react-native-linear-gradient';
import {Font} from '../constants/Font';

const PasswordReset = () => {
  const {width} = Dimensions.get('window');
  const [email, setEmail] = useState('');
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const isEmailValid = email => /\S+@\S+\.\S+/.test(email);
  // Update the email ref
  const handleEmail = text => {
    setEmail(text);
  };
  // Handle sending OTP
  const sendOtp = useCallback(async () => {
    setLoading(true);
    if (!isEmailValid(email.trim())) {
      ToastAndroid.show('Invalid email format.', ToastAndroid.SHORT);
      setLoading(false);
      return false;
    }

    try {
      const emailExists = await checkEmail(); // Await checkEmail response

      if (emailExists) {
        setLoading(false);

        nav.navigate('otpVerification', {email: email.toLowerCase()});
      } else {
        ToastAndroid.show(
          "Email doesn't exist, try another email",
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      ToastAndroid.show(
        'Something went wrong. Please try again.',
        ToastAndroid.LONG,
      );
    }
  }, [email, nav]);

  const checkEmail = useCallback(async () => {
    try {
      const res = await axios.post(`${loginApi}/LogIn/splash`, {
        Email: email.toLowerCase().trim(),
      });
      if (res.status == 200) {
        return true; // Email exists
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }, [loginApi, email]);

  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      colors={['#fff9f3', '#eef7fe']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          // borderWidth: 1,
          borderColor: 'white',
          width: '80%',
          //   rowGap: 10,
        }}>
        <MaterialIcons name="fingerprint" size={60} color={Colors.lightGrey} />

        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 2,
            // fontWeight: '600',
            fontSize: width * 0.053,
            width: '100%',
            textAlign: 'center',
            marginBottom: 20,
            fontFamily: Font.SemiBold,
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
            fontFamily: Font.Medium,
          }}>
          No worries, we'll send you reset instructions.
        </Text>
        <Text
          style={{
            textAlign: 'left',
            width: '100%',
            color: Colors.mildGrey,
            fontSize: width * 0.027,
            fontFamily: Font.Medium,
          }}>
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
            fontFamily: Font.Medium,
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
            flexDirection: 'row',
            justifyContent: 'center',
            columnGap: 5,
            // borderWidth: 1,
          }}>
          <Text style={{color: 'white', fontFamily: Font.SemiBold}}>
            Send OTP
          </Text>
          {loading && <ActivityIndicator color={Colors.white} size={20} />}
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
          <Text style={{color: Colors.lightGrey, fontFamily: Font.Medium}}>
            Back To Login
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PasswordReset;

const styles = StyleSheet.create({});
