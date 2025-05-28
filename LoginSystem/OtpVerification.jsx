import {
  TextInput,
  View,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {loginApi} from '../Api';
import LinearGradient from 'react-native-linear-gradient';
import {Font} from '../constants/Font';
const OtpVerification = () => {
  const {width} = Dimensions.get('window');
  const {email} = useRoute().params;
  const nav = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '']); // Store OTP digits
  const inputs = useRef([]); // Store references to input boxes
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [mainOtp, setMainOtp] = useState();
  const handleFocus = index => {
    setFocusedIndex(index);
  };
  // Simulated user OTP from the database

  // Handle input change
  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      // Ensure only a single digit
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setFocusedIndex(index + 1);
      // Move to the next input box
      if (index < 3) {
        inputs.current[index + 1]?.focus();
      } else {
        validateOtp(newOtp);
      }
    }
  };

  // Handle backspace
  const handleBackspace = (text, index) => {
    if (text === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    setFocusedIndex(index - 1);
    const newOtp = [...otp];
    newOtp[index] = ''; // Clear the current box
    setOtp(newOtp);
  };

  // Validate OTP against the database
  const validateOtp = otpArray => {
    const otpString = otpArray.join(''); // Combine array into a string
    if (otpString.length < 4 || isNaN(otpString)) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
      return;
    }

    const enteredOtp = parseInt(otpString, 10); // Convert to integer

    // Check with the user data OTP
    if (enteredOtp === mainOtp) {
      Alert.alert('Success', 'OTP is valid!');
      nav.navigate('setPassword', {email});
    } else {
      Alert.alert('Invalid OTP', 'The entered OTP is incorrect.');
    }
  };
  // resend otp time limit
  const [timeLimit, setTimeLimit] = useState(30);
  useEffect(() => {
    if (timeLimit > 0) {
      const interval = setInterval(() => {
        setTimeLimit(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLimit]);
  // -------
  const generateAndSendOtp = useCallback(async () => {
    // Generate a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // Ensures a 4-digit OTP
    setMainOtp(otp);

    try {
      // Send OTP to server
      await axios.post(`${loginApi}/LogIn/sendResetPassOtp`, {
        email,
        otp,
      });
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }, []);

  useEffect(() => {
    // Call generateAndSendOtp when the component mounts
    generateAndSendOtp();
  }, [generateAndSendOtp]);

  // Resend OTP handler
  const handleResendOtp = () => {
    generateAndSendOtp(); // Reuse the same function for resending OTP
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      colors={['#fff9f3', '#eef7fe']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          // borderWidth: 1,
          borderColor: 'white',
          width: '80%',
          rowGap: 10,
        }}>
        <TouchableOpacity>
          <Ionicons
            name="mail-open-outline"
            size={50}
            color={Colors.lightGrey}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 2,
            fontWeight: '600',
            fontSize: width * 0.053,
            width: '100%',
            textAlign: 'center',
            marginBottom: 20,
            fontFamily: Font.SemiBold,
          }}>
          Enter OTP
        </Text>
        <Text
          style={{
            letterSpacing: 1,
            color: Colors.mildGrey,
            fontSize: width * 0.03,
          }}>
          We send a otp to{' '}
          <Text
            style={{
              color: Colors.veryDarkGrey,
              fontWeight: '600',
              fontFamily: Font.SemiBold,
            }}>
            {email}
          </Text>
        </Text>
        {/* otps */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            // borderWidth: 1,
            alignItems: 'center',
            width: '100%',
            marginBottom: 20,
          }}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.input,
                focusedIndex === index && styles.focusedInput,
                digit && styles.filledInput, // Add border when text is entered
              ]}
              onFocus={() => handleFocus(index)}
              value={digit}
              placeholder="0"
              onChangeText={text => handleChange(text, index)}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace('', index);
                }
              }}
              keyboardType="numeric"
              maxLength={1}
              ref={ref => (inputs.current[index] = ref)} // Store input refs
            />
          ))}
        </View>
        {/* resend otp */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text
            onPress={() => handleResendOtp()}
            style={{
              textAlign: 'right',
              fontWeight: '600',
              color: !timeLimit <= 0 ? Colors.lightGrey : Colors.violet,
              fontFamily: Font.Medium,
            }}>
            {timeLimit > 0 && (
              <Text
                style={{
                  color: Colors.lightGrey,
                  marginRight: 20,
                  fontFamily: Font.Medium,
                }}>
                {timeLimit}
              </Text>
            )}
            Resend OTP?
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
            marginBottom: 20,
          }}>
          <AntDesign name="arrowleft" size={20} color={Colors.lightGrey} />
          <Text style={{color: Colors.lightGrey, fontFamily: Font.Light}}>
            Back To Login
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default OtpVerification;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 50,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    textAlign: 'center',
    // fontSize: 24,
    marginHorizontal: 5,
    borderColor: Colors.lightGrey, // Default border color
  },
  focusedInput: {
    borderColor: '#4CAF50', // Green border when focused
  },
  filledInput: {
    borderColor: '#2196F3', // Blue border when text is entered
  },
});
