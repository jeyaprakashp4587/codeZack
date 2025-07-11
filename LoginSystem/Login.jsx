import React, {useState, useCallback} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {Colors} from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import {useNavigation} from '@react-navigation/native';
import {loginApi} from '../Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import TypingEffect from '../utils/TypingEffect';
import {Font} from '../constants/Font';
const {width, height} = Dimensions.get('window');

const Login = () => {
  const {setUser} = useData();
  const navigation = useNavigation();
  const [hidePassword, setHidePassword] = useState(true);
  const [form, setForm] = useState({
    Email: '',
    Password: '',
  });

  const [activityIndi, setActivityIndi] = useState(false);

  const handleEmail = useCallback((name, text) => {
    setForm(prevForm => ({...prevForm, [name]: text}));
  }, []);

  const handlePassword = useCallback((name, text) => {
    setForm(prevForm => ({...prevForm, [name]: text}));
  }, []);

  const isEmailValid = email => /\S+@\S+\.\S+/.test(email);

  const validateForm = useCallback(() => {
    if (!isEmailValid(form.Email)) {
      // Alert.alert('Invalid email format.');
      ToastAndroid.show('Invalid email format.', ToastAndroid.SHORT);
      return false;
    }
    for (let key in form) {
      if (!form[key]) {
        // Alert.alert(`${key} is required.`);
        ToastAndroid.show(`${key} is required`, ToastAndroid.SHORT);
        return false;
      }
    }
    return true;
  }, [form]);
  //update
  const HandleLogin = useCallback(async () => {
    setActivityIndi(true);
    if (!validateForm()) {
      setActivityIndi(false);
      return;
    }
    try {
      const res = await axios.post(`${loginApi}/LogIn/signIn`, form);

      // Check if login was successful
      if (res.status === 200) {
        await AsyncStorage.setItem('Email', res.data?.user?.Email);
        setUser(res.data?.user);
        navigation.navigate('Tab');
      } else if (res.status === 401) {
        ToastAndroid.show(res.data.error, ToastAndroid.SHORT);
      }
    } catch (error) {
      // Handle specific server errors
      if (error.response) {
        // Error response from server
        const errorMessage =
          error.response.data?.error || 'Login failed, please try again.';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      } else {
        // Network or other errors
        ToastAndroid.show(
          'Network error, please try again.',
          ToastAndroid.SHORT,
        );
      }
    } finally {
      setActivityIndi(false);
    }
  }, [form, validateForm, setUser, navigation]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        style={{
          flex: 1,
          borderWidth: 0,
          height: height * 1,
          paddingHorizontal: 25,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        colors={['#fff9f3', '#eef7fe']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.image}
            source={require('../assets/CZ.png')}
            priority={FastImage.priority.high}
            resizeMode="contain"
          />
          <TypingEffect />
        </View>
        <View style={styles.inputsWrapper}>
          <View
            style={{
              height: height * 0.055,
              backgroundColor: 'white',
              borderRadius: 5,
              // elevation: 2,
            }}>
            <TextInput
              spellCheck={true}
              style={{
                paddingLeft: 10,
                color: Colors.veryDarkGrey,
                fontFamily: Font.Regular,
                // fontSize: width * 0.0,
              }}
              placeholder="Email"
              placeholderTextColor={Colors.mildGrey}
              onChangeText={text => handleEmail('Email', text.trim())}
            />
          </View>
          <View
            style={{
              height: height * 0.055,
              backgroundColor: Colors.white,
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 10,
            }}>
            <TextInput
              style={{
                paddingLeft: 10,
                color: Colors.veryDarkGrey,
                flex: 1,
                borderColor: 'black',
                fontFamily: Font.Regular,
              }}
              placeholder="Password"
              placeholderTextColor={Colors.mildGrey}
              secureTextEntry={hidePassword}
              onChangeText={text => handlePassword('Password', text.trim())}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              <Ionicons
                name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={HandleLogin}
            style={{
              backgroundColor: Colors.violet,
              height: height * 0.055,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            {activityIndi ? (
              <ActivityIndicator size={width * 0.045} color={Colors.white} />
            ) : (
              <Text style={styles.loginText}>Login </Text>
            )}
          </TouchableOpacity>
        </View>
        {/* forgot password */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            <Text
              onPress={() => navigation.navigate('passwordReset')}
              style={{
                color: Colors.violet,
                textAlign: 'right',
                fontFamily: Font.Medium,
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        {/* forgot password */}
        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>OR</Text>
        </View>
        <View style={styles.signUpContainer}>
          <Text
            style={{
              color: Colors.mildGrey,
              // fontWeight: '400',
              fontFamily: Font.SemiBold,
            }}>
            Create New account
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    fontSize: width * 0.09,
    color: 'hsl(0, 0%, 50%)',
    paddingBottom: height * 0.015,
    fontFamily: Font.Regular,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.4,
    alignSelf: 'center',
    aspectRatio: 1,
    borderRadius: 20,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    lineHeight: height * 0.04,
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
    // fontWeight: '600',
    fontFamily: Font.SemiBold,
  },
  inputsWrapper: {
    flexDirection: 'column',
    marginVertical: height * 0.025,
    rowGap: 10,
  },
  loginText: {
    letterSpacing: 0.3,
    fontSize: width * 0.035,
    color: Colors.white,
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Font.Medium,
  },
  indicator: {
    width: '100%',
    height: height * 0.002,
    backgroundColor: Colors.veryLightGrey,
    marginVertical: height * 0.025,
    position: 'relative',
  },
  indicatorText: {
    position: 'absolute',
    color: Colors.mildGrey,
    top: -height * 0.012,
    textAlign: 'center',
    alignSelf: 'center',
    zIndex: 10,
    fontFamily: Font.Regular,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: height * 0.025, // Dynamic margin
  },
  signUpLink: {
    color: Colors.violet,
    textDecorationLine: 'underline',
    paddingHorizontal: width * 0.025,
    fontFamily: Font.SemiBold,
    // fontSize: width * 0.02,
  },
});

export default Login;
