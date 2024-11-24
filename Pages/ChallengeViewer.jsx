import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';

import {useData} from '../Context/Contexter';
import axios from 'axios';
import {functionApi} from '../Api';
import TopicsText from '../utils/TopicsText';
import {Colors, pageView} from '../constants/Colors';
import WebView from 'react-native-webview';

const ChallengeViewer = () => {
  const {width, height} = Dimensions.get('window');
  const {user, selectedChallenge} = useData();
  const [challenge, setChallenge] = useState();
  const [webViewSource, setWebViewSource] = useState({
    uri: challenge?.LiveLink,
  });
  const fallbackURL = {uri: 'https://example.com'}; // Replace with your dummy URL
  const getChallenge = async () => {
    const res = await axios.get(
      `${functionApi}/Challenges/getCompletedChallenge/${user?._id}/${selectedChallenge?.title}`,
    );
    if (res.data) {
      setChallenge(res.data);
      // console.log(res.data);
    }
  };
  console.log(challenge);
  useEffect(() => {
    getChallenge();
  }, []);
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <TopicsText text="Challenge View" />
        <Text
          style={{
            fontSize: width * 0.045,
            letterSpacing: 1,
            color: Colors.mildGrey,
          }}>
          {challenge?.ChallengeName}
        </Text>

        <Text
          onPress={() => Linking.openURL(challenge?.RepoLink)}
          style={{
            fontSize: width * 0.04,
            letterSpacing: 1,
            color: Colors.violet,
            marginVertical: 10,
            textDecorationLine: 'underline',
          }}>
          {challenge?.RepoLink}
        </Text>
        <Text
          onPress={() => Linking.openURL(challenge?.LiveLink)}
          style={{
            fontSize: width * 0.04,
            letterSpacing: 1,
            color: Colors.violet,
            textDecorationLine: 'underline',
          }}>
          {challenge?.LiveLink}
        </Text>
        {/*  */}
        <Text
          style={{
            fontSize: width * 0.05,
            letterSpacing: 1,
            color: 'black',
            marginVertical: 10,
          }}>
          Your Solution
        </Text>
        {challenge?.SnapImage && (
          <Image
            source={{uri: challenge?.SnapImage}}
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'contain',
              // borderWidth: 1,
              marginVertical: 10,
            }}
          />
        )}
      </View>
      {/* webview */}
      <Text
        style={{
          fontSize: width * 0.05,
          letterSpacing: 1,
          color: 'black',
          marginVertical: 10,
          paddingHorizontal: 20,
        }}>
        Live View
      </Text>
      <View
        style={{
          borderWidth: 0,
          flex: 1,
          borderRadius: 10,
          marginBottom: 10,
        }}>
        <WebView
          javaScriptEnabled={true}
          scrollEnabled={true}
          nestedScrollEnabled
          source={{uri: webViewSource}}
          style={{borderWidth: 1, height: height * 0.8}}
          onError={() => setWebViewSource(fallbackURL)}
        />
      </View>
    </ScrollView>
  );
};

export default ChallengeViewer;

const styles = StyleSheet.create({});
