import axios from 'axios';
import React, {useRef, useCallback, useState} from 'react';
import {
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';
import HeadingText from '../utils/HeadingText';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';

const UploadProject = () => {
  const {user} = useData();

  // Input states
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  const showToast = useCallback(message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }, []);

  const getFormData = () => ({
    projectTitle,
    description,
    whatsApp,
    mobileNumber,
    skills: skillsInput
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0),
  });

  const validateForm = useCallback(() => {
    const {projectTitle, description, whatsApp, mobileNumber, skills} =
      getFormData();

    if (!projectTitle.trim()) {
      showToast('Project title is required');
      return false;
    }
    if (!description.trim()) {
      showToast('Description is required');
      return false;
    }
    if (!whatsApp.trim()) {
      showToast('WhatsApp number is required');
      return false;
    }
    if (!/^\d{10}$/.test(whatsApp)) {
      showToast('WhatsApp number must be 10 digits');
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
  }, [
    projectTitle,
    description,
    whatsApp,
    mobileNumber,
    skillsInput,
    showToast,
  ]);

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setProjectTitle('');
    setDescription('');
    setWhatsApp('');
    setMobileNumber('');
    setSkillsInput('');
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        ...getFormData(),
        uId: user?._id,
      };

      const {data, status} = await axios.post(
        `${profileApi}/Freelancing/submitProject`,
        payload,
      );

      if (status === 200) {
        showToast('Form submitted successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Submission Error:', error);
      showToast('Something went wrong during submission');
    } finally {
      setLoading(false);
    }
  }, [validateForm, getFormData, user, showToast]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <HeadingText text="project requirements" />
      </View>
      <View style={{rowGap: 10, flex: 1}}>
        <TextInput
          placeholder="Project Title"
          placeholderTextColor={Colors.mildGrey}
          style={styles.input}
          value={projectTitle}
          onChangeText={setProjectTitle}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor={Colors.mildGrey}
          style={[styles.input, {height: 100}]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          placeholder="What's App Number"
          placeholderTextColor={Colors.mildGrey}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={10}
          value={whatsApp}
          onChangeText={setWhatsApp}
        />
        <TextInput
          placeholder="Mobile Number"
          placeholderTextColor={Colors.mildGrey}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
        <TextInput
          placeholder="Skills (comma separated)"
          placeholderTextColor={Colors.mildGrey}
          style={styles.input}
          value={skillsInput}
          onChangeText={setSkillsInput}
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
            {loading ? 'Submitting...' : 'Upload'}
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
