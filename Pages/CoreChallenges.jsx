import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import PragraphText from '../utils/PragraphText';
import {useData} from '../Context/Contexter';
import {pageView} from '../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Api from '../Api';

const CoreChallenges = () => {
  const {selectedChallengeTopic} = useData();
  const [challenges, setChallenges] = useState();
  // get all challeges
  const getChallenges = useCallback(async () => {
    try {
      const res = await axios.get(`${Api}/Challenges/getChallenges`, {
        params: {ChallengeTopic: selectedChallengeTopic},
      });
      if (res.data) {
        console.log(res.data);
        setChallenges(res.data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }, [selectedChallengeTopic]);

  useFocusEffect(
    useCallback(() => {
      getChallenges();
    }, [getChallenges]),
  );
  return (
    <View style={pageView}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <PragraphText text={selectedChallengeTopic} fsize={28} />
      </View>
      {/* challenge list */}
    </View>
  );
};

export default CoreChallenges;

const styles = StyleSheet.create({});
