import axios from 'axios';
import React, {useRef, useCallback, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';

const UploadProject = () => {
  const formRef = useRef({
    projectTitle: '',
    description: '',
    whatsApp: '',
    mobileNumber: '',
    skills: [],
  });
  const {user} = useData();
  const showToast = useCallback(message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }, []);

  const handleInputChange = useCallback(
    (field, value) => {
      try {
        if (field === 'skills') {
          formRef.current.skills = value
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);
        } else {
          formRef.current[field] = value;
        }
      } catch (error) {
        showToast('Error updating input');
      }
    },
    [showToast],
  );

  const validateForm = useCallback(() => {
    const {projectTitle, description, whatsApp, mobileNumber, skills} =
      formRef.current;

    if (!projectTitle.trim()) {
      showToast('Project title is required');
      return false;
    }
    if (!description.trim()) {
      showToast('Description is required');
      return false;
    }
    if (!whatsApp.trim()) {
      showToast('whats app number is required');
      return false;
    }
    if (!/^\d{10}$/.test(whatsApp)) {
      showToast('whats app number must be 10 digits');
      return false;
    }
    if (!mobileNumber.trim()) {
      showToast('Mobile number is required');
      return false;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      showToast('Mobile number must be 10 digits');
      return false;
    }
    if (!skills || skills.length === 0) {
      showToast('At least one skill is required');
      return false;
    }

    return true;
  }, [showToast]);
  // load indi
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(async () => {
    try {
      if (validateForm()) {
        setLoading(true);
        const {data, status} = await axios.post(
          `${profileApi}/Freelancing/submitProject`,
          {
            ...formRef.current,
            uId: user?._id,
          },
        );
        if (status === 200) {
          setLoading(false);
          showToast('Form submitted successfully!');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Submission Error:', error);
      showToast('Something went wrong during submission');
    }
  }, [validateForm, showToast]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <HeadingText text="project requirements" />
      </View>
      <View
        style={{
          rowGap: 10,
          flex: 1,
        }}>
        <TextInput
          placeholderTextColor={Colors.mildGrey}
          placeholder="Project Title"
          style={styles.input}
          onChangeText={text => handleInputChange('projectTitle', text)}
        />
        <TextInput
          placeholder="Description"
          style={[styles.input, {height: 100}]}
          placeholderTextColor={Colors.mildGrey}
          multiline
          onChangeText={text => handleInputChange('description', text)}
        />
        <TextInput
          placeholder="what's app Number"
          placeholderTextColor={Colors.mildGrey}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={text => handleInputChange('whatsApp', text)}
        />
        <TextInput
          placeholder="Mobile Number"
          style={styles.input}
          placeholderTextColor={Colors.mildGrey}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={text => handleInputChange('mobileNumber', text)}
        />
        <TextInput
          placeholder="Skills (comma separated)"
          placeholderTextColor={Colors.mildGrey}
          style={styles.input}
          onChangeText={text => handleInputChange('skills', text)}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: Colors.violet,
            padding: 10,
            borderRadius: 10,
            width: '100%',
          }}>
          <Text
            style={{
              fontFamily: Font.Medium,
              color: Colors.white,
              letterSpacing: 0.25,
              textAlign: 'center',
            }}>
            upload
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.veryLightGrey,
    padding: 15,
    borderRadius: 5,
    color: Colors.veryDarkGrey,
    width: '100%',
    fontFamily: Font.Regular,
  },
});

export default UploadProject;
