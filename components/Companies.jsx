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
import {Colors} from '../constants/Colors';
import axios from 'axios';
import {profileApi} from '../Api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useData} from '../Context/Contexter';
import LinearGradient from 'react-native-linear-gradient';
import Skeleton from '../Skeletons/Skeleton';

const Companies = () => {
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const {setSelectedCompany, user} = useData();
  // console.log(user?.InterView);

  // set interview details and navigate
  const handleSetInterView = useCallback(async name => {
    navigation.navigate('InterviewDetail');
    setSelectedCompany(name);
  }, []);
  // get all companies name and logo
  const [companies, setCompanies] = useState([]);
  const getCompanyDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${profileApi}/InterView/getCompanyDetails`);
      if (res.status === 200) {
        let companies = res.data;
        console.log(res.data);

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

  if (!companies) {
    return (
      <View
        style={{
          // paddingHorizontal: 15,
          marginBottom: 10,
          flexDirection: 'row',
          columnGap: 10,
          borderWidth: 1,
        }}>
        <Skeleton width={width * 0.6} height={height * 0.14} radius={20} />
        <Skeleton width={width * 0.6} height={height * 0.14} radius={20} />
      </View>
    );
  }
  //
  return (
    <View style={{paddingLeft: 0, marginBottom: 10}}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={companies}
        renderItem={({item, index}) => (
          <LinearGradient
            // colors={['black', '#1e1815', '#4b3d34', '#806859']}
            colors={item?.colors}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            style={{
              marginRight: 15,
              borderRadius: 15,
              padding: 15,
              flexDirection: 'column',
              rowGap: 10,
              elevation: 4,
              marginVertical: 5,
              marginLeft: index == 0 && 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <View style={{borderWidth: 0, flex: 1}}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'left',
                    fontWeight: '400',
                    letterSpacing: 1,
                    fontSize: width * 0.04,
                  }}>
                  {item?.company_name}
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    letterSpacing: 1,
                    fontSize: width * 0.05,
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
                    height: height * 0.05,
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
                  borderWidth: 0.7,
                  borderColor: 'white',
                  padding: 10,
                  width: '100%',
                  borderRadius: 50,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    textAlign: 'center',
                    letterSpacing: 1,
                    fontSize: width * 0.025,
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
          </LinearGradient>
        )}
      />
    </View>
  );
};

export default Companies;

const styles = StyleSheet.create({});
