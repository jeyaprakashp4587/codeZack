import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useData} from '../Context/Contexter';
import {pageView} from '../constants/Colors';

const CoreChallengeViewer = () => {
  const {selectedChallengeTopic, SelectedChallenge} = useData();
  return (
    <View style={pageView}>
      <Text>CoreChallengeViewer</Text>
    </View>
  );
};

export default CoreChallengeViewer;

const styles = StyleSheet.create({});
