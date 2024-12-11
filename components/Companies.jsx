import {
  Dimensions,
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

const Companies = () => {
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const {setSelectedCompany} = useData();
  // set interview details and navigate
  const handleSetInterView = useCallback(async name => {
    navigation.navigate('InterviewDetail');
    setSelectedCompany(name);
  }, []);
  // get all companies name and logo
  const [companies, setCompanies] = useState([]);
  const getCompanyDetails = useCallback(async () => {
    const res = await axios.get(`${profileApi}/InterView/getCompanyDetails`);
    if (res.status == 200) {
      //   console.log(res.data);
      setCompanies(res.data);
    }
  }, []);
  //
  useEffect(() => {
    getCompanyDetails();
  }, []);
  //
  return (
    <ScrollView
      style={{
        marginBottom: 10,
        paddingLeft: 15,
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      {companies.map((comp, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSetInterView(comp?.company_name)}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.veryLightGrey,
            padding: width * 0.04,
            borderRadius: 10,
            flexDirection: 'column',
            rowGap: 15,
            backgroundColor: 'white',
            alignItems: 'center',
            marginRight: 15,
          }}>
          <View
            style={{
              borderWidth: 0,
              width: width * 0.3,
              height: height * 0.05,
              // flex: 1.5,
            }}>
            <Image
              source={{uri: comp?.companyLogo}}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text
            style={{
              // flex: 1,
              letterSpacing: 2,
              color: Colors.mildGrey,
              textAlign: 'center',
            }}>
            Prepare For {comp?.company_name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Companies;

const styles = StyleSheet.create({});
