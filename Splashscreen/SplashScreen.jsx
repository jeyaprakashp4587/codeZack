import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors, pageView} from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
// import ProgressBar from '../utils/ProgressBar';
import {useEffect} from 'react';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {loginApi} from '../Api';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import FastImage from 'react-native-fast-image';

const SplashScreen = () => {
  const {user, setUser} = useData();
  const {height, width} = Dimensions.get('window');
  const nav = useNavigation();
  const [activityIndicator, setActivityIndicator] = useState(true);

  // Function to handle auto login
  const validLogin = useCallback(async () => {
    try {
      const email = await AsyncStorage.getItem('Email');
      if (email) {
        const response = await axios.post(`${loginApi}/LogIn/splash`, {
          Email: email,
        });

        if (response.status == 200 && response.data.user) {
          setActivityIndicator(false);
          console.log(response.data.user);
          setUser(response.data.user);
          nav.navigate('Tab');
          // nav.navigate('login'); // Navigate to the main app if login is valid
        } else {
          setActivityIndicator(false);
          nav.navigate('login'); // Navigate to login screen if email not found
        }
      } else {
        nav.navigate('login');
      }
    } catch (error) {
      console.error('Error during auto-login:', error);
    }
  }, [nav, setUser]);

  useEffect(() => {
    nav.addListener('focus', () => {
      validLogin();
    });
    // Call auto login on component mount
  }, [validLogin, nav]);

  return (
    <View
      style={[pageView, {flexDirection: 'column', justifyContent: 'center'}]}>
      <View
        style={{
          // borderWidth: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 100,
        }}>
        <FastImage
          source={require('../assets/CC.png')}
          style={{
            width: width * 0.9,
            height: height * 0.5,
            borderRadius: 50,
          }}
        />

        {/* progress bar */}
        <View style={{position: 'absolute', bottom: -height * 0.08}}>
          {activityIndicator && (
            <ActivityIndicator size={80} color={Colors.mildGrey} />
          )}
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
