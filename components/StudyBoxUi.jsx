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

const {width} = Dimensions.get('window');

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
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.buttonText}>Next ▶️</Text>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  topicCode: {
    fontFamily: 'monospace',
    backgroundColor: '#000',
    color: '#0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  topicContent: {
    marginBottom: 10,
    fontSize: 16,
  },
  topicOutput: {
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  buttonText: {
    color: 'white',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
});

export default StudyBoxUi;
