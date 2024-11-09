import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../constants/Colors';
import axios from 'axios';
import Api from '../Api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const Companies = () => {
  const navigation = useNavigation();
  // set interview details and navigate
  const handleSetInterView = useCallback(async () => {}, []);
  // get all companies name and logo
  const [companies, setCompanies] = useState([]);
  const getCompanyDetails = useCallback(async () => {
    const res = await axios.get(`${Api}/InterView/getCompanyDetails`);
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
    <View>
      {companies.map(comp => (
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.veryLightGrey,
            padding: 15,
            borderRadius: 10,
            flexDirection: 'column',
            rowGap: 5,
            backgroundColor: 'white',
            // elevation: 2,
          }}>
          <Image
            source={{uri: comp?.companyLogo}}
            style={{width: 85, height: 50}}
          />
          <Text style={{letterSpacing: 2, color: Colors.mildGrey}}>
            Prepare For {comp?.company_name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Companies;

const styles = StyleSheet.create({});
