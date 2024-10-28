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
import Api from '../Api';
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
        const response = await axios.post(`${Api}/LogIn/splash`, {
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
    validLogin(); // Call auto login on component mount
  }, [validLogin]);

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
        {/* <Image
          source={require("../assets/images/splash.png")}
          style={{
            width: 400,
            height: 400,
          }}
        /> */}

        <Text
          style={{
            // fontFamily: "PopIns-Regular",
            fontSize: 40,
          }}>
          Code Campus
        </Text>
        <FontAwesomeIcon
          icon={faCode}
          size={300}
          color={Colors.veryLightGrey}
          style={{position: 'absolute', zIndex: -10, top: -120}}
        />
        {/* progress bar */}
        <View style={{position: 'absolute', bottom: -300}}>
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
