import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useData} from '../../Context/Contexter';
import {Colors, pageView} from '../../constants/Colors';
import TopicsText from '../../utils/TopicsText';
import WebView from 'react-native-webview';
import HeadingText from '../../utils/HeadingText';
import {Font} from '../../constants/Font';

const CoreChallengeViewer = () => {
  const {width, height} = Dimensions.get('window');
  const {selectedChallengeTopic, selectedChallenge} = useData();
  // console.log(selectedChallengeTopic, selectedChallenge);

  return (
    <ScrollView style={pageView} showsVerticalScrollIndicator={false}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Coding Ground" mb={4} />
      </View>
      <TouchableOpacity
        style={{
          marginVertical: 10,
          backgroundColor: 'white',
          elevation: 3,
          marginHorizontal: 15,
          padding: 15,
          borderRadius: 10,
          flexDirection: 'column',
          rowGap: 7,
        }}>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 1,
            fontSize: width * 0.045,
            fontFamily: Font.Regular,
          }}>
          <Text>{selectedChallenge?.question_id}.</Text>
          {selectedChallenge?.title}
        </Text>
        <Text
          style={{
            letterSpacing: 1,
            color: Colors.mildGrey,
            fontSize: width * 0.035,
          }}>
          {selectedChallenge?.description}
        </Text>
        <Text
          style={{
            color: '#1d3557',
            // fontWeight: '600',
            letterSpacing: 1,
            fontSize: width * 0.03,
            fontFamily: Font.SemiBold,
          }}>
          <Text style={{fontFamily: Font.Regular}}>Inputs: </Text>
          {selectedChallenge?.input_example}
        </Text>
        <Text
          style={{color: '#ee6c4d', letterSpacing: 1, fontSize: width * 0.03}}>
          <Text style={{fontFamily: Font.Regular}}>Output: </Text>{' '}
          {selectedChallenge?.output_example}
        </Text>
      </TouchableOpacity>
      {/* web view */}
      <View style={{flex: 1}}>
        <WebView
          source={{uri: selectedChallengeTopic?.web}}
          style={{borderWidth: 1, height: 700}}
          scrollEnabled={true}
        />
      </View>
    </ScrollView>
  );
};

export default CoreChallengeViewer;

const styles = StyleSheet.create({});
