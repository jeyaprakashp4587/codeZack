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
          // setActivityIndicator(false);
          setUser(response.data.user);
          nav.navigate('Tab');
        } else {
          setActivityIndicator(false);
          nav.navigate('login'); // Navigate to login screen if email not found
        }
      } else {
        nav.navigate('login');
      }
    } catch (error) {
      console.error('Error during auto-login:', error);
      nav.navigate('login');
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
          source={require('../assets/CZ.png')}
          style={{
            width: width * 0.5,
            borderRadius: 50,
            aspectRatio: 1,
          }}
        />
        {/* progress bar */}
        <View>
          {activityIndicator && (
            <ActivityIndicator size={width * 0.15} color="black" />
          )}
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
