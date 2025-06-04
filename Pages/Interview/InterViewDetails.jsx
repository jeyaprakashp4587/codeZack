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
import {Colors, pageView} from '../../constants/Colors';
import {useData} from '../../Context/Contexter';
import axios from 'axios';
import {profileApi} from '../../Api';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {Font} from '../../constants/Font';
const {width, height} = Dimensions.get('window');

const InterViewDetails = () => {
  const {selectedCompany, setSelectedCompany, user, setUser} = useData();
  const {width, height} = Dimensions.get('window');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {
    load: loadInterest,
    isClosed: interestClosed,
    show: showInterest,
    isLoaded: interestIsLoaded,
  } = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  useEffect(() => {
    loadInterest();
  }, [loadInterest]);
  useEffect(() => {
    if (interestClosed) {
      loadInterest();
    }
  }, [interestClosed, loadInterest]);
  // check company is already exists
  const checkCompanyExists = () => {
    const existingInterview = user?.InterView?.some(
      interview =>
        interview.companyName === selectedCompany ||
        selectedCompany?.company_name,
    );
    if (existingInterview) {
      navigation.replace('InterviewPreparation');
    }
  };
  // get particular company
  const [company, setCompany] = useState();
  const getParticularCompany = useCallback(async () => {
    const res = await axios.post(
      `${profileApi}/InterView/getParticularCompany`,
      {
        companyName: selectedCompany || selectedCompany?.company_name,
      },
    );
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
      const res = await axios.post(`${profileApi}/InterView/addInterView`, {
        companyName: selectedCompany?.company_name || selectedCompany,
        userId: user?._id,
      });
      if (res.status === 200) {
        if (interestIsLoaded) {
          showInterest();
        }
        setUser(prev => ({...prev, InterView: res.data.User}));
        navigation.replace('InterviewPreparation');
        // console.log(res.data.message); // Success message
      } else if (res.status === 400 && res.data.message === 'Exists') {
        navigation.replace('InterviewPreparation');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Exists'
      ) {
        navigation.replace('InterviewPreparation');
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
        <FastImage
          priority={FastImage.priority.high}
          source={{uri: company?.companyLogo}}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
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
          style={{
            fontSize: width * 0.09,
            // fontWeight: '600',
            letterSpacing: 1,
            fontFamily: Font.SemiBold,
          }}>
          {company?.company_name}
        </Text>
        <Text
          style={{
            letterSpacing: 0.3,
            color: Colors.veryDarkGrey,
            // fontWeight: '600',
            fontSize: width * 0.04,
            fontFamily: Font.SemiBold,
          }}>
          Duration: {company?.preparation_duration}
        </Text>
        <Text
          style={{
            letterSpacing: 0.2,
            color: Colors.veryDarkGrey,
            // fontWeight: '600',
            fontSize: width * 0.04,
            fontFamily: Font.SemiBold,
          }}>
          Weeks: {company?.weeks?.length}
        </Text>
        <Text
          style={{
            letterSpacing: 0.2,
            lineHeight: 30,
            color: Colors.violet,
            // fontWeight: '600',
            fontSize: width * 0.035,
            fontFamily: Font.Medium,
          }}>
          "Step Up, Skill Up – Land Your Dream Job in Your Dream Company!"
        </Text>
        <TouchableOpacity
          onPress={() => handleAddInterview()}
          style={{
            backgroundColor: Colors.violet,
            borderWidth: 0.4,
            borderColor: '#2b2d42',
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40,
            columnGap: 10,
          }}>
          {/* */}
          {loading ? (
            <ActivityIndicator color={Colors.white} size={23} />
          ) : (
            <Text
              style={{
                letterSpacing: 0.5,
                color: Colors.white,
                fontFamily: Font.SemiBold,
              }}>
              Let's Start
            </Text>
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
