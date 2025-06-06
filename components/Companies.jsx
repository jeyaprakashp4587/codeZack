import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {profileApi} from '../Api';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import Skeleton from '../Skeletons/Skeleton';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';

const Companies = () => {
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const {setSelectedCompany, user} = useData();
  // destructuring and load add
  const {load, isLoaded, show, isClosed} = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {requestNonPersonalizedAdsOnly: true},
  );
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed]);
  // set interview details and navigate
  const handleSetInterView = useCallback(
    async name => {
      navigation.navigate('InterviewDetail');
      setSelectedCompany(name);
      if (isLoaded) {
        // await show();
      }
    },
    [isLoaded, show],
  );
  // get all companies name and logo
  const [companies, setCompanies] = useState([]);
  const getCompanyDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${profileApi}/InterView/getCompanyDetails`);
      if (res.status === 200) {
        let companies = res.data;
        // Find all companies the user is enrolled in
        const enrolledCompanies = companies.filter(item =>
          user?.InterView?.some(
            userComp => userComp?.companyName === item?.company_name,
          ),
        );
        // Filter out enrolled companies from the main list
        const otherCompanies = companies.filter(
          item =>
            !user?.InterView?.some(
              userComp => userComp?.companyName === item?.company_name,
            ),
        );
        // Combine enrolled companies at the beginning of the list
        companies = [...enrolledCompanies, ...otherCompanies];

        setCompanies(companies);
        return companies;
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  }, [user]);

  useEffect(() => {
    getCompanyDetails();
  }, []);

  if (companies.length <= 0) {
    return (
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 15,
        }}>
        <Skeleton width={width * 0.6} height={height * 0.14} radius={20} />
        <Skeleton width={width * 0.6} height={height * 0.14} radius={20} />
      </View>
    );
  }
  //
  return (
    <View>
      <Text
        style={{
          fontFamily: Font.Medium,
          fontSize: width * 0.041,
          marginBottom: 10,
          letterSpacing: 0.25,
          paddingHorizontal: 15,
        }}>
        Interview preparation kit
      </Text>
      <FlatList
        nestedScrollEnabled={true}
        horizontal
        initialNumToRender={2}
        showsHorizontalScrollIndicator={false}
        data={companies}
        renderItem={({item, index}) => (
          <View
            style={{
              marginRight: 15,
              borderRadius: 10,
              padding: 15,
              flexDirection: 'column',
              rowGap: 15,
              elevation: 1,
              marginVertical: 5,
              marginLeft: index == 0 && 15,
              backgroundColor: item?.colors[item?.colors?.length - 1],
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                columnGap: 15,
              }}>
              <View style={{borderWidth: 0, flex: 1, rowGap: 5}}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'left',
                    // fontWeight: '700',
                    letterSpacing: 1,
                    fontSize: width * 0.05,
                    fontFamily: Font.SemiBold,
                  }}>
                  {item?.company_name}
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    letterSpacing: 1,
                    fontSize: width * 0.035,
                    fontFamily: Font.Regular,
                  }}>
                  6 Weeks
                </Text>
              </View>
              <View style={{borderWidth: 0, flex: 1}}>
                <Image
                  source={{uri: item?.companyLogo}}
                  style={{
                    resizeMode: 'contain',
                    width: width * 0.35,
                    height: height * 0.08,
                    // aspectRatio: 1,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => handleSetInterView(item?.company_name)}
                style={{
                  // borderWidth: 0.7,
                  borderColor: 'rgba(26, 25, 25, 0.52)',
                  // padding: 10,
                  width: '100%',
                  borderRadius: 20,
                  padding: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    textAlign: 'center',
                    letterSpacing: 0.3,
                    fontSize: width * 0.029,
                    fontFamily: Font.SemiBold,
                  }}>
                  {user?.InterView?.some(
                    userComp => userComp?.companyName == item?.company_name,
                  )
                    ? 'Continue'
                    : 'Start'}{' '}
                  your Preparation
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Companies;

const styles = StyleSheet.create({});
