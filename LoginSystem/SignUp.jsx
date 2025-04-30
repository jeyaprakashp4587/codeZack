import React, {useRef, useState, useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Ripple from 'react-native-material-ripple';
import {loginApi} from '../Api';
import {Colors, font, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import HeadingText from '../utils/HeadingText';
import {Font} from '../constants/Font';

const {width, height} = Dimensions.get('window');

const SignUp = ({navigation}) => {
  // References to each input
  const refs = useRef({
    First_Name: React.createRef(),
    Last_Name: React.createRef(),
    Email: React.createRef(),
    Password: React.createRef(),
    Confirm_Password: React.createRef(),
    Gender: React.createRef(),
    DOB: React.createRef(),
    Degree_name: React.createRef(),
    Institute_Name: React.createRef(),
    State: React.createRef(),
    District: React.createRef(),
    Nationality: React.createRef(),
  }).current;

  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    Confirm_Password: '',
    Gender: '',
    DOB: '',
    Degree_name: '',
    Institute_Name: '',
    State: '',
    District: '',
    Nationality: '',
  });

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [actiloading, setActiloading] = useState(false);
  const {setUser} = useData();
  const handleInput = useCallback((name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  }, []);

  const validateForm = () => {
    let isValid = true;
    const {Password, Confirm_Password, Email} = formData;

    for (let key in formData) {
      if (!formData[key]) {
        refs[key].current.setNativeProps({
          style: {borderColor: 'red', borderWidth: 1, borderRadius: 5},
        });
        isValid = false;
        ToastAndroid.show(
          'Please Fill the requires Fields',
          ToastAndroid.BOTTOM,
        );
      } else {
        refs[key].current.setNativeProps({
          style: {borderColor: Colors.veryLightGrey, borderWidth: 1},
        });
      }
    }

    if (Password !== Confirm_Password) {
      refs.Confirm_Password.current.setNativeProps({
        style: {borderColor: 'red', borderWidth: 1},
      });
      Alert.alert('Passwords do not match!');
      isValid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(Email)) {
      refs.Email.current.setNativeProps({
        style: {borderColor: 'red', borderWidth: 1},
      });
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    setActiloading(true);
    if (validateForm()) {
      try {
        const response = await axios.post(`${loginApi}/LogIn/signUp`, formData);
        if (response.data.message == 'SignUp Sucessfully') {
          ToastAndroid.show('Signup Successfully', ToastAndroid.BOTTOM);
          await AsyncStorage.setItem('Email', response.data.user.Email);
          navigation.navigate('Tab');
          setUser(response.data.user);
        } else if (response.data === 'Email has Already Been Taken') {
          // Alert.alert();
          ToastAndroid.show(
            'Email has already been taken',
            ToastAndroid.BOTTOM,
          );
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Signup failed. Try again.');
      } finally {
        setActiloading(false);
      }
    } else {
      setActiloading(false);
    }
  };

  const handleGenderSelect = gender => {
    handleInput('Gender', gender);
    setShowGenderModal(false);
  };

  return (
    <LinearGradient
      style={{
        paddingHorizontal: width * 0.05,
        // paddingBottom: height * 0.02,
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'column',
        // borderWidth: 1,
      }}
      colors={['#fff9f3', '#eef7fe']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      {/* <Text style={styles.headerText}>Sign Up</Text> */}
      <View>
        <HeadingText text="sign up" />
      </View>
      <ScrollView
        style={{flex: 1, borderWidth: 0}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'column',
              rowGap: 5,
              paddingHorizontal: width * 0.01,
            }}>
            {Object.keys(formData).map(key => (
              <TextInput
                style={{
                  marginTop: height * 0.005,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  paddingHorizontal: width * 0.03,
                  paddingVertical: height * 0.015,
                  borderWidth: 1,
                  borderColor: Colors.white,
                  elevation: 1.2,
                  letterSpacing: 1,
                  fontFamily: Font.Regular,
                  color: 'black',
                }}
                key={key}
                placeholder={key.replace('_', ' ')}
                placeholderTextColor={Colors.mildGrey}
                ref={refs[key]}
                onFocus={() => key === 'Gender' && setShowGenderModal(true)}
                onChangeText={text => handleInput(key, text.trim())}
                value={key == 'Gender' ? formData[key] : null}
              />
            ))}
          </View>
          <View style={{height: height * 0.02}} />
          <Ripple onPress={handleSignUp} style={styles.signUpButton}>
            {actiloading ? (
              <ActivityIndicator size={width * 0.063} color={Colors.white} />
            ) : (
              <Text style={styles.signUpText}>Signup</Text>
            )}
          </Ripple>
        </View>
        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Select Gender</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleGenderSelect('Male')}>
                <Text style={styles.modalButtonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleGenderSelect('Female')}>
                <Text style={styles.modalButtonText}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowGenderModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

export default React.memo(SignUp);

const styles = StyleSheet.create({
  headerText: {
    fontSize: width * 0.09,
    color: 'hsl(0, 0%, 50%)',
    paddingBottom: height * 0.01,
    fontFamily: 'Poppins-Medium',
  },
  imageContainer: {
    paddingBottom: height * 0.02,
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    alignSelf: 'center',
  },
  subText: {
    textAlign: 'center',
    color: Colors.veryDarkGrey,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
  },
  signUpButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: height * 0.015,
    borderRadius: 5,
    width: '97%',
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 0.4,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.violet,
    columnGap: 10,
    marginHorizontal: width * 0.1,
  },
  signUpText: {
    fontSize: width * 0.037,
    color: Colors.white,
    letterSpacing: 1.5,
    fontFamily: 'Poppins-Medium',
  },
  backgroundIcon: {
    position: 'absolute',
    zIndex: -10,
    top: height * 0.5,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    padding: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: width * 0.05,
    marginBottom: height * 0.02,
  },
  modalButton: {
    padding: height * 0.015,
    borderRadius: 5,
    backgroundColor: Colors.violet,
    marginTop: height * 0.01,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: width * 0.04,
    color: 'white',
    fontFamily: 'Poppins-Light',
  },
});
