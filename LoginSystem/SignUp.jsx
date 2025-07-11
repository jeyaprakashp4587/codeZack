import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import HeadingText from '../utils/HeadingText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {loginApi} from '../Api';
import {useData} from '../Context/Contexter';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

const SignUp = () => {
  const offset = useSharedValue(0);
  const [step, setStep] = useState(0);
  const navigation = useNavigation();
  const {setUser} = useData();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    state: '',
    city: '',
    institution: '',
    image: '',
  });

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [uploadImgIndi, setUploadImgIndi] = useState(false);
  const [actiLoading, setActiloading] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const selectImage = async () => {
    try {
      setUploadImgIndi(true);
      const options = {
        mediaType: 'photo',
        selectionLimit: 1,
      };
      const result = await launchImageLibrary(options);

      if (result.didCancel || result.errorMessage) {
        setUploadImgIndi(false);
        return;
      }

      if (result?.assets?.length) {
        const uploadedImages = await Promise.all(
          result.assets.map(async asset => {
            try {
              return await hostImage(asset.uri);
            } catch (error) {
              return null;
            }
          }),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploadImgIndi(false);
    }
  };

  const hostImage = useCallback(async imageUri => {
    try {
      const data = new FormData();
      data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'Post.jpg',
      });
      data.append('upload_preset', 'ml_default');
      data.append('api_key', '1z2Ft0vr7dBtH4BW1fuDhZXHox8');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dogo7hkhy/image/upload',
        {
          method: 'POST',
          body: data,
        },
      );

      const result = await res.json();

      if (result?.secure_url) {
        setFormData(prev => ({...prev, image: result.secure_url}));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }, []);

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      const next = step + 1;
      setStep(next);
      offset.value = withTiming(-width * next, {duration: 300});
    }
  };

  const validateStep = useCallback(
    async current => {
      let newErrors = {};

      switch (current) {
        case 0:
          if (!formData.firstName.trim())
            newErrors.firstName = 'First name is required';
          if (!formData.lastName.trim())
            newErrors.lastName = 'Last name is required';
          if (!formData.gender) newErrors.gender = 'Select gender';
          break;

        case 1:
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Valid email required';
          try {
            const {data, status} = await axios.post(
              `${loginApi}/LogIn/verifyEmail`,
              {
                Email: formData.email,
              },
            );
            if (data.exists && status === 200) {
              newErrors.email = 'Email has Already Been Taken';
            }
          } catch (error) {
            console.warn('Email check error:', error);
          }

          if (formData.password.length < 6)
            newErrors.password = 'Password must be min 6 characters';

          if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
          break;

        case 3:
          if (!formData.state) newErrors.state = 'State is required';
          if (!formData.city) newErrors.city = 'City is required';
          if (!formData.institution)
            newErrors.institution = 'Institution name is required';
          break;
      }

      if (Object.keys(newErrors).length > 0) {
        ToastAndroid.show(Object.values(newErrors)[0], ToastAndroid.SHORT);
        return false;
      }

      return true;
    },
    [formData],
  );

  const handleSubmit = useCallback(async () => {
    try {
      setActiloading(true);
      const isValid = await validateStep(step);
      if (!isValid) return;

      const response = await axios.post(`${loginApi}/LogIn/signUp`, formData);

      if (
        response.status === 200 &&
        response.data.message === 'SignUp Sucessfully'
      ) {
        ToastAndroid.show('Signup Successfully', ToastAndroid.BOTTOM);
        navigation.replace('Tab');
        setUser(response.data.user);
        await AsyncStorage.setItem('Email', response.data.user.Email);
      } else {
        ToastAndroid.show(response.data, ToastAndroid.BOTTOM);
      }
    } catch (error) {
      Alert.alert('Signup failed. Try again.');
    } finally {
      setActiloading(false);
    }
  }, [formData, step]);

  const renderStep = step => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepBox}>
            <Text style={styles.label}>Tell me{'\n'}about you</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={text => handleChange('firstName', text)}
              placeholder="Enter first name"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={text => handleChange('lastName', text)}
              placeholder="Enter last name"
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowGenderModal(true)}>
              <Text style={{color: Colors.mildGrey, fontFamily: Font.Medium}}>
                {formData.gender || 'Select your gender'}
              </Text>
            </TouchableOpacity>

            <Modal visible={showGenderModal} transparent animationType="fade">
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <Pressable
                      key={g}
                      onPress={() => {
                        handleChange('gender', g);
                        setShowGenderModal(false);
                      }}>
                      <Text style={styles.modalOption}>{g}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </Modal>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepBox}>
            <Text style={styles.label}>Setup{'\n'}Your information</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Enter email"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              value={formData.password}
              onChangeText={text => handleChange('password', text)}
              placeholder="Enter password"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
              placeholder="Confirm password"
              placeholderTextColor="#888"
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepBox}>
            <Text style={styles.label}>Upload Your{'\n'}Profile picture</Text>
            <FastImage
              source={{
                uri: formData.image || 'https://i.ibb.co/Y4NtjRR0/user.png',
                priority: FastImage.priority.high,
              }}
              style={{
                width: width * 0.4,
                aspectRatio: 1,
                borderRadius: 100,
                alignSelf: 'center',
                marginVertical: 30,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={selectImage}
              style={{
                alignItems: 'center',
                height: height * 0.064,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.violet,
                borderRadius: 10,
              }}>
              {uploadImgIndi ? (
                <ActivityIndicator color={Colors.veryDarkGrey} />
              ) : (
                <Text
                  style={{fontFamily: Font.Medium, color: Colors.veryDarkGrey}}>
                  Upload
                </Text>
              )}
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepBox}>
            <Text style={styles.label}>Where are you{'\n'}coming from?</Text>
            <TextInput
              style={styles.input}
              value={formData.state}
              onChangeText={text => handleChange('state', text)}
              placeholder="Enter your state"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={text => handleChange('city', text)}
              placeholder="Enter your city"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={formData.institution}
              onChangeText={text => handleChange('institution', text)}
              placeholder="Enter institution name"
              placeholderTextColor="#888"
            />
          </View>
        );
    }
  };

  const PaginationDots = ({stepOffset}) => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map(i => {
          const dotStyle = useAnimatedStyle(() => {
            const inputRange = [-width * (i + 1), -width * i, -width * (i - 1)];
            const scale = interpolate(
              stepOffset.value,
              inputRange,
              [0.8, 1.4, 0.8],
              Extrapolate.CLAMP,
            );
            const opacity = interpolate(
              stepOffset.value,
              inputRange,
              [0.3, 1, 0.3],
              Extrapolate.CLAMP,
            );
            return {transform: [{scale}], opacity};
          });

          return <Animated.View key={i} style={[styles.dot, dotStyle]} />;
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff9f3', '#eef7fe']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, height: height}}>
          <View style={{paddingHorizontal: 15}}>
            <HeadingText text="Sign up" />
          </View>
          <Animated.View style={[styles.slider, animatedStyle]}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={styles.step}>
                {renderStep(i)}
              </View>
            ))}
          </Animated.View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={step === 3 ? handleSubmit : handleNext}>
            {actiLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.nextText}>
                {step === 3
                  ? 'Submit'
                  : step === 2 && !formData.image
                  ? 'Skip'
                  : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
          <PaginationDots stepOffset={offset} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  slider: {
    flexDirection: 'row',
    width: width * 4,
    flex: 1,
  },
  step: {
    width: width,
    justifyContent: 'center',
    padding: 20,
  },
  stepBox: {
    rowGap: 10,
  },
  label: {
    fontSize: width * 0.1,
    fontFamily: Font.SemiBold,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 15,
    color: Colors.veryDarkGrey,
    fontSize: width * 0.036,
    fontFamily: Font.Regular,
    letterSpacing: 0.25,
  },
  nextBtn: {
    backgroundColor: Colors.violet,
    margin: 20,
    borderRadius: 100,
    alignItems: 'center',
    height: height * 0.064,
    justifyContent: 'center',
  },
  nextText: {
    color: Colors.white,
    fontFamily: Font.SemiBold,
    fontSize: width * 0.04,
    letterSpacing: 0.3,
  },
  modalButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    fontSize: width * 0.045,
    marginVertical: 10,
    color: Colors.veryDarkGrey,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(17, 66, 129)',
  },
});

export default SignUp;
