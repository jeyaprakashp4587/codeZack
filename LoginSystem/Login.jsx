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
} from 'react-native';
import {Colors} from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useData} from '../Context/Contexter';
import {useNavigation} from '@react-navigation/native';
import {loginApi} from '../Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
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
      const {data} = await axios.post(`${loginApi}/LogIn/signIn`, form);

      if (data?.firstName) {
        await AsyncStorage.setItem('Email', data.Email);
        setUser(data);
        navigation.navigate('Tab');
      } else {
        ToastAndroid.show(
          'Email or Password is incorrect.',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Login error:', error);

      ToastAndroid.show('Login failed, please try again.', ToastAndroid.SHORT);
    } finally {
      setActivityIndi(false);
    }
  }, [form, validateForm, setUser, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView style={styles.pageView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Log In</Text>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: 'https://i.ibb.co/P5s1nZ5/loginbg.png'}}
              style={styles.image}
            />
            <Text style={styles.welcomeText}>
              Welcome To Code Campus, Growth Your Career From Here
            </Text>
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
              }}>
              <TextInput
                style={{
                  borderWidth: 0,
                  flex: 1,
                  paddingLeft: 10,
                  color: Colors.veryDarkGrey,
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
              {activityIndi && (
                <ActivityIndicator size="small" color={Colors.mildGrey} />
              )}
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>OR</Text>
          </View>
          <View style={styles.signUpContainer}>
            <Text style={{color: Colors.mildGrey, fontWeight: '700'}}>
              Create New account
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('signup')}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    textAlign: 'center',
    fontSize: width * 0.09, // Dynamic font size
    color: 'hsl(0, 0%, 50%)',
    paddingBottom: height * 0.015, // Dynamic padding
  },
  container: {
    paddingHorizontal: width * 0.08,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    alignSelf: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    lineHeight: height * 0.04,
    color: Colors.veryDarkGrey,
    letterSpacing: 1,
  },
  inputsWrapper: {
    flexDirection: 'column',
    // rowGap: , // Dynamic gap
    marginVertical: height * 0.025,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: width * 0.025, // Dynamic padding
    borderColor: Colors.veryLightGrey,
    borderWidth: 1,
    paddingVertical: 10,
    color: Colors.veryDarkGrey,
    marginVertical: height * 0.01, // Dynamic margin
  },
  loginButton: {
    backgroundColor: Colors.veryLightGrey,
    padding: height * 0.02, // Dynamic padding
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 10,
  },
  loginText: {
    fontWeight: '400',
    letterSpacing: 1,
    fontSize: width * 0.035, // Dynamic font size
    color: 'white',
  },
  indicator: {
    width: '100%',
    height: height * 0.002, // Dynamic height for indicator line
    backgroundColor: Colors.violet,
    marginVertical: height * 0.025, // Dynamic margin
    position: 'relative',
  },
  indicatorText: {
    position: 'absolute',
    color: Colors.lightGrey,
    backgroundColor: 'white',
    top: -height * 0.012, // Dynamic position adjustment
    textAlign: 'center',
    alignSelf: 'center',
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
    fontWeight: '600', // Dynamic padding
  },
});

export default Login;
