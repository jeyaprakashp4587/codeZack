import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Colors, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import axios from 'axios';
import {loginApi} from '../Api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import TopicsText from '../utils/TopicsText';
import Skeleton from '../Skeletons/Skeleton';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');
const InterViewDetails = () => {
  const {selectedCompany, setSelectedCompany, user, setUser} = useData();
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // check company is lresy exists
  const checkCompanyExists = () => {
    const existingInterview = user?.InterView?.some(
      interview =>
        interview.companyName === selectedCompany ||
        selectedCompany?.company_name,
    );
    if (existingInterview) {
      // Navigate to the desired screen if the company exists
      navigation.navigate('InterviewPreparation');
    }
  };
  // get particular company
  const [company, setCompany] = useState();
  const getParticularCompany = useCallback(async () => {
    const res = await axios.post(`${loginApi}/InterView/getParticularCompany`, {
      // selectedcompany in initlaly have company name then its have whole compant data
      companyName: selectedCompany || selectedCompany?.company_name,
    });
    if (res.status == 200) {
      setCompany(res.data);
      setLoad(false);
      // console.log(res.data);
      setSelectedCompany(res.data);
    }
  }, []);
  useEffect(
    useCallback(() => {
      getParticularCompany();
      checkCompanyExists();
    }, [company]),
    [],
  );
  // add interview preparation
  const handleAddInterview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${loginApi}/InterView/addInterView`, {
        companyName: selectedCompany?.company_name || selectedCompany,
        userId: user?._id,
      });

      if (res.status === 200) {
        setUser(res.data.User);
        navigation.navigate('InterviewPreparation');
        // console.log(res.data.message); // Success message
      } else if (res.status === 400 && res.data.message === 'Exists') {
        navigation.navigate('InterviewPreparation');
        // console.log('Company interview entry already exists.');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Exists'
      ) {
        // console.log('Company interview entry already exists.');
        navigation.navigate('InterviewPreparation');
      } else {
        console.error('An error occurred:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCompany, user?._id]);
  // load skeleton
  const [load, setLoad] = useState(true);
  if (load) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator color={Colors.mildGrey} size={20} />
      </View>
    );
  }
  //
  return (
    <LinearGradient
      style={styles.container}
      colors={['#fff9f3', '#eef7fe']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      {/* preparetion duration */}
      <View
        style={{
          width: width * 0.7,
          height: height * 0.2,
          paddingHorizontal: 15,
        }}>
        <Image
          source={{uri: company?.companyLogo}}
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
        />
      </View>
      {/* compant name */}
      <View
        style={{
          paddingHorizontal: 15,
          marginTop: 20,
          flexDirection: 'column',
          rowGap: 10,
        }}>
        <Text
          style={{fontSize: width * 0.09, fontWeight: '600', letterSpacing: 1}}>
          {company?.company_name}
        </Text>
        <Text
          style={{
            letterSpacing: 2,
            color: Colors.veryDarkGrey,
            fontWeight: '600',
            fontSize: width * 0.04,
          }}>
          Duration: {company?.preparation_duration}
        </Text>
        <Text
          style={{
            letterSpacing: 2,
            color: Colors.mildGrey,
            fontWeight: '600',
            fontSize: width * 0.04,
          }}>
          Weeks: {company?.weeks?.length}
        </Text>
        <Text
          style={{
            letterSpacing: 1,
            lineHeight: 30,
            color: Colors.violet,
            fontWeight: '600',
            fontSize: width * 0.035,
          }}>
          "Step Up, Skill Up – Land Your Dream Job in Your Dream Company!"
        </Text>
        <TouchableOpacity
          onPress={() => handleAddInterview()}
          style={{
            // backgroundColor: 'white',
            borderWidth: 0.4,
            borderColor: '#2b2d42',
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40,
            columnGap: 10,
          }}>
          <Text
            style={{
              letterSpacing: 2,
              color: Colors.veryDarkGrey,
              fontWeight: '600',
            }}>
            Let's Start
          </Text>
          {loading && (
            <ActivityIndicator color={Colors.veryDarkGrey} size={20} />
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default InterViewDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // backgroundColor: 'white',
    flex: 1,
    // alignSelf: 'center',
  },
});
