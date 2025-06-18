import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Font} from '../constants/Font';
import {Colors} from '../constants/Colors';

const {width, height} = Dimensions.get('window');

const StudyBoxUi = ({courseData, topicLength, handleSetTopicsLength}) => {
  const currentTopic = courseData[topicLength];
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const handleNext = () => {
    translateX.value = withTiming(-width, {duration: 400}, () => {
      translateX.value = 0;
      runOnJS(handleSetTopicsLength)();
    });
  };

  if (!currentTopic) return null;

  return (
    <View style={styles.outer}>
      <Animated.View style={[styles.topicContainer, animatedStyle]}>
        <Text style={styles.topicTitle}>Topic: {currentTopic?.title}</Text>
        <Text style={styles.topicCode}>{currentTopic?.code}</Text>
        <Text style={styles.topicContent}>
          Content: {currentTopic?.content}
        </Text>
        <Text style={styles.topicOutput}>Output: {currentTopic?.output}</Text>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
    width: '100%',
  },
  topicContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(233, 235, 232, 0.15)',
    borderRadius: 16,
  },
  topicTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  topicCode: {
    fontFamily: 'monospace',
    backgroundColor: 'rgba(36, 36, 35, 0.23)',
    color: 'rgb(17, 17, 16)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  topicContent: {
    marginBottom: 10,
    fontSize: width * 0.04,
    lineHeight: 22,
    fontFamily: Font.Medium,
  },
  topicOutput: {
    marginBottom: 20,
    color: 'rgb(16, 24, 37)',
    fontSize: width * 0.034,
  },
  button: {
    height: height * 0.056,
    borderWidth: 1,
    borderColor: Colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: Colors.violet,
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
  },
});

export default StudyBoxUi;
