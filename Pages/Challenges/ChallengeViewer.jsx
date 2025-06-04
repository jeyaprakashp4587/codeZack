import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  InteractionManager,
} from 'react-native';

import {useData} from '../../Context/Contexter';
import axios from 'axios';
import {challengesApi} from '../../Api';
import TopicsText from '../../utils/TopicsText';
import {Colors} from '../../constants/Colors';
import WebView from 'react-native-webview';

const ChallengeViewer = () => {
  const {width, height} = Dimensions.get('window');
  const {user, selectedChallenge} = useData();
  const [challenge, setChallenge] = useState(null);
  const [webViewSource, setWebViewSource] = useState('');
  const [webViewError, setWebViewError] = useState(false); // Track errors in WebView
  const fallbackURL = 'https://example.com'; // Dummy fallback URL

  // Function to validate URL
  const isValidURL = url => {
    if (typeof url !== 'string') {
      return false;
    }

    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
      'i',
    );
    return !!urlPattern.test(url);
  };

  // Fetch Challenge Details
  const getChallenge = async () => {
    try {
      const res = await axios.get(
        `${challengesApi}/Challenges/getCompletedChallenge/${user?._id}/${selectedChallenge?.title}`,
      );

      if (res.data) {
        setChallenge(res.data);

        let liveLink = res.data?.LiveLink;

        // Ensure LiveLink is a string before setting it
        if (Array.isArray(liveLink)) {
          liveLink = liveLink[0]; // Take the first URL if it's an array
        }

        if (isValidURL(liveLink)) {
          setWebViewSource(liveLink);
        } else {
          setWebViewError(true);
        }
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setWebViewError(true);
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => getChallenge());
    return () => task.cancel();
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

        {/* Repository Link */}
        {challenge?.RepoLink && isValidURL(challenge?.RepoLink) && (
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
        )}

        {/* Live Link */}
        {challenge?.LiveLink && isValidURL(challenge?.LiveLink) && (
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
        )}

        <Text
          style={{
            fontSize: width * 0.05,
            letterSpacing: 1,
            color: 'black',
            marginVertical: 10,
          }}>
          Your Solution
        </Text>

        {/* Snapshot Image */}
        {challenge?.SnapImage && (
          <Image
            source={{uri: challenge?.SnapImage}}
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'contain',
              marginVertical: 10,
            }}
          />
        )}
      </View>

      {/* WebView */}
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
        {webViewError || !webViewSource ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Unable to load the content. Please check the URL or try again
              later.
            </Text>
          </View>
        ) : (
          <WebView
            javaScriptEnabled={true}
            scrollEnabled={true}
            nestedScrollEnabled
            source={{uri: webViewSource.toString()}} // Ensure it's a string
            style={{borderWidth: 1, height: height * 0.8}}
            onError={() => setWebViewError(true)}
          />
        )}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChallengeViewer;
