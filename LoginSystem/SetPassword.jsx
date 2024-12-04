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
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors} from '../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {loginApi} from '../Api';

const SetPassword = () => {
  const {width} = Dimensions.get('window');
  const {email} = useRoute().params;
  const nav = useNavigation();

  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');
  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleResetPassword = useCallback(async () => {
    // Reset errors
    setErrors({password: false, confirmPassword: false});

    // Get values from refs
    const password = passwordRef.current;
    const confirmPassword = confirmPasswordRef.current;

    // Validation checks
    let isValid = true;

    if (password.length < 6) {
      setErrors(prev => ({...prev, password: true}));
      isValid = false;
    }

    if (password !== confirmPassword) {
      setErrors(prev => ({...prev, confirmPassword: true}));
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    // Simulate server response
    try {
      const response = await axios.post(`${loginApi}/LogIn/resetNewPassword`, {
        email: email.trim(),
        password,
      });
      if (response.status == 200 && response.data.msg == 'ok') {
        ToastAndroid.show('Password reset sucessfully.', ToastAndroid.SHORT);
        nav.navigate('login'); // Redirect to login
      } else {
        alert(result.message || 'Failed to reset password. Try again later.');
      }
    } catch (error) {
      console.log(error);
    }
  }, [email, nav]);

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
            marginBottom: 5,
          }}>
          Set new password
        </Text>
        <Text
          style={{
            letterSpacing: 1,
            color: Colors.mildGrey,
            fontSize: width * 0.03,
          }}>
          Must be at least 6 characters
        </Text>
        <View style={{width: '100%'}}>
          <Text
            style={{
              textAlign: 'left',
              width: '100%',
              color: Colors.mildGrey,
              letterSpacing: 1.4,
              fontSize: width * 0.03,
            }}>
            Password
          </Text>
          <TextInput
            placeholder="Password"
            style={{
              borderWidth: 0.6,
              borderColor: errors.password ? 'red' : Colors.lightGrey,
              borderRadius: 5,
              width: '100%',
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
            secureTextEntry
            onChangeText={text => (passwordRef.current = text)}
          />
        </View>
        <View style={{width: '100%'}}>
          <Text
            style={{
              textAlign: 'left',
              width: '100%',
              color: Colors.mildGrey,
              letterSpacing: 1.4,
              fontSize: width * 0.03,
            }}>
            Confirm Password
          </Text>
          <TextInput
            placeholder="Confirm Password"
            style={{
              borderWidth: 0.6,
              borderColor: errors.confirmPassword ? 'red' : Colors.lightGrey,
              borderRadius: 5,
              width: '100%',
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
            secureTextEntry
            onChangeText={text => (confirmPasswordRef.current = text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleResetPassword}
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

export default SetPassword;
