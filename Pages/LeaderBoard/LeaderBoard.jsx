import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {Colors} from '../../constants/Colors';
import HeadingText from '../../utils/HeadingText';
import axios from 'axios';
import {Api} from '../../Api';

const LeaderBoard = () => {
  const {width, height} = Dimensions.get('window');
  const get = useCallback(async () => {
    await axios.get(`${Api}/LeaderBoard/getLeaderBoard`);
  }, []);
  useEffect(() => {
    get();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Leaderboard" />
      </View>
    </View>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({});
