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

        if (response.data.Email) {
          setActivityIndicator(false);
          setUser(response.data);
          nav.navigate('Tab'); // Navigate to the main app if login is valid
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
        <Image
          source={{
            uri: 'https://i.ibb.co/MVMBJRM/ic-launcher-removebg-preview.png',
          }}
          style={{
            width: width * 0.9,
            height: height * 0.5,
          }}
        />

        {/* progress bar */}
        <View style={{position: 'absolute', bottom: -height * 0.08}}>
          {activityIndicator && (
            <ActivityIndicator size={50} color={Colors.mildGrey} />
          )}
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
