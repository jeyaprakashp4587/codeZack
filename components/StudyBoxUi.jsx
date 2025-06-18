import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ToastAndroid,
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
  const [quizValid, setQuizValid] = useState(false);
  const translateX = useSharedValue(0);

  const currentTopic = useMemo(
    () => courseData[topicLength],
    [courseData, topicLength],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const handleNext = useCallback(() => {
    if (!quizValid) {
      ToastAndroid.show('Choose the quiz option', ToastAndroid.SHORT);
      return;
    }

    translateX.value = withTiming(-width, {duration: 400}, () => {
      translateX.value = 0;
      runOnJS(handleSetTopicsLength)(); // Correctly passed as function
      runOnJS(setQuizValid)(false); // reset state for next topic
    });
  }, [quizValid, handleSetTopicsLength]);

  const handleSelectOption = useCallback(
    option => {
      if (option === currentTopic?.quiz?.answer) {
        setQuizValid(true);
      } else {
        setQuizValid(false);
        ToastAndroid.show('Wrong answer', ToastAndroid.SHORT);
      }
    },
    [currentTopic],
  );

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

        {/* Quiz Section */}
        <View style={{rowGap: 10}}>
          <Text style={styles.quizTitle}>Quiz:</Text>
          <Text style={styles.quizQuestion}>
            {currentTopic?.quiz?.question}
          </Text>

          <View style={{rowGap: 5}}>
            {currentTopic?.quiz?.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectOption(option)}
                style={styles.quizOption}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextBtn,
            {
              backgroundColor: quizValid
                ? Colors.violet
                : 'rgba(54, 56, 53, 0.32)',
              borderColor: quizValid ? Colors.violet : 'rgba(54, 56, 53, 0.32)',
            },
          ]}>
          <Text style={{color: Colors.white}}>Next</Text>
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
    color: 'rgb(10, 27, 54)',
    fontSize: width * 0.034,
    fontFamily: Font.Medium,
    letterSpacing: 0.3,
  },
  quizTitle: {
    fontFamily: Font.SemiBold,
    fontSize: width * 0.06,
  },
  quizQuestion: {
    fontSize: width * 0.04,
    fontFamily: Font.Medium,
    color: Colors.veryDarkGrey,
  },
  quizOption: {
    padding: 10,
    backgroundColor: 'rgba(59, 59, 59, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  optionText: {
    textAlign: 'center',
    width: '100%',
    fontFamily: Font.Medium,
    fontSize: width * 0.03,
  },
  nextBtn: {
    height: height * 0.056,
    borderWidth: 1,
    borderColor: Colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 10,
  },
});

export default StudyBoxUi;
