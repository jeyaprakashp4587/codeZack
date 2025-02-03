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
const {width, height} = Dimensions.get('window');

const Login = () => {
  // console.log(loginApi);

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
      if (res.data?.user) {
        await AsyncStorage.setItem('Email', res.data?.user?.Email);
        setUser(res.data?.user);
        navigation.navigate('Tab');
      } else {
        // Unexpected response format
        ToastAndroid.show('Unexpected server response.', ToastAndroid.SHORT);
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
        {/* <View style={{borderWidth: 1, flex: 1, height: '100%'}}> */}
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.image}
            source={require('../assets/loginHero.png')}
            priority={FastImage.priority.high}
            resizeMode="contain"
          />
          <TypingEffect />
        </View>
        <View style={styles.inputsWrapper}>
          <TextInput
            spellCheck={true}
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={Colors.mildGrey}
            onChangeText={text => handleEmail('Email', text)}
          />
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: Colors.veryLightGrey,
              borderRadius: 5,
              justifyContent: 'space-between',
              alignItems: 'center',
              columnGap: 10,
              // paddingHorizontal: 10,
              paddingRight: 10,
              backgroundColor: 'white',
            }}>
            <TextInput
              style={{
                borderWidth: 0,
                flex: 1,
                paddingLeft: 10,
                color: Colors.veryDarkGrey,
                // paddingVertical: height * 0.08,
              }}
              placeholder="Password"
              placeholderTextColor={Colors.mildGrey}
              secureTextEntry={hidePassword}
              onChangeText={text => handlePassword('Password', text)}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              <Ionicons
                name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={HandleLogin} style={styles.loginButton}>
            {activityIndi ? (
              <ActivityIndicator size={width * 0.045} color={Colors.white} />
            ) : (
              <Text style={styles.loginText}>Login</Text>
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
                letterSpacing: 1,
                textAlign: 'right',
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
          <Text style={{color: Colors.mildGrey, fontWeight: '400'}}>
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
    fontSize: width * 0.09, // Dynamic font size
    color: 'hsl(0, 0%, 50%)',
    paddingBottom: height * 0.015, // Dynamic padding
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.6,
    alignSelf: 'center',
    aspectRatio: 1,
    borderRadius: 20,
    // elevation: 10,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    lineHeight: height * 0.04,
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
    fontWeight: '600',
  },
  inputsWrapper: {
    flexDirection: 'column',
    // rowGap: , // Dynamic gap
    marginVertical: height * 0.025,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: width * 0.035, // Dynamic padding
    borderColor: Colors.veryLightGrey,
    borderWidth: 1,
    paddingVertical: height * 0.017,
    color: Colors.veryDarkGrey,
    marginVertical: height * 0.01, // Dynamic margin
  },
  loginButton: {
    backgroundColor: '#415a77',
    padding: height * 0.015, // Dynamic padding
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 10,
    borderColor: Colors.veryDarkGrey,
  },
  loginText: {
    letterSpacing: 2,
    fontSize: width * 0.035, // Dynamic font size
    color: Colors.white,
  },
  indicator: {
    width: '100%',
    height: height * 0.002, // Dynamic height for indicator line
    backgroundColor: Colors.veryLightGrey,
    marginVertical: height * 0.025, // Dynamic margin
    position: 'relative',
  },
  indicatorText: {
    position: 'absolute',
    color: Colors.mildGrey,
    // backgroundColor: 'white',
    top: -height * 0.012, // Dynamic position adjustment
    textAlign: 'center',
    alignSelf: 'center',
    zIndex: 10,
  },

  signUpContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: height * 0.025, // Dynamic margin
  },
  signUpLink: {
    color: 'orange',
    textDecorationLine: 'underline',
    paddingHorizontal: width * 0.025,
    // fontWeight: '400', // Dynamic padding
  },
});

export default Login;
