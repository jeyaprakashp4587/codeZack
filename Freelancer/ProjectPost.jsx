import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';

const ProjectPost = () => {
  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      {/* header */}
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="explore projects" />
      </View>
    </View>
  );
};

export default ProjectPost;

const styles = StyleSheet.create({});
