import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {pageView} from '../constants/Colors';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';

const VideoTutorials = () => {
  return (
    <View style={pageView}>
      <Text>VideoTutorials</Text>
      <YoutubePlayer
        height={300}
        play={true}
        videoId="KUoBYPMbaps&t" // Replace with your desired YouTube video ID
      />
    </View>
  );
};

export default VideoTutorials;

const styles = StyleSheet.create({});
