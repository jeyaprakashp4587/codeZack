import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import TopicsText from '../../utils/TopicsText';
import {functionApi} from '../../Api';
import {useData} from '../../Context/Contexter';
import axios from 'axios';
import {
  View,
  Text,
  Button,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PragraphText from '../../utils/PragraphText';
import {Colors} from '../../constants/Colors';
import Actitivity from '../../hooks/ActivityHook';
import Skeleton from '../../Skeletons/Skeleton';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import HeadingText from '../../utils/HeadingText';
import {Font} from '../../constants/Font';

const AssignmentPlayGround = () => {
  const {assignmentType, user, setUser} = useData();
  const {width, height} = Dimensions.get('window');
  const [currentQuiz, setCurrentQuiz] = useState();
  const difficulty = ['easy', 'medium', 'hard'];
  const [difficultyInfo, setDifficultyInfo] = useState('easy');
  // load and destructure Intrestial add
  const addCount = useRef(0);
  const {load, isLoaded, show, isClosed} = useInterstitialAd(
    __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3257747925516984/9392069002',
    {requestNonPersonalizedAdsOnly: true},
  );
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);

  const checkExistsLevel = useCallback(
    level => {
      const findAssignment = user?.Assignments?.find(
        item =>
          item.AssignmentType.toLowerCase() === assignmentType.toLowerCase(),
      );
      if (findAssignment) {
        const final = findAssignment.AssignmentLevel.find(
          item => item.LevelType === level,
        );
        return Boolean(final); // Returns true if the level exists, otherwise false
      }
      return false;
    },
    [user, assignmentType], // Removed difficultyInfo from dependencies
  );

  const getNextAvailableLevel = level => {
    const currentIndex = difficulty.indexOf(level);
    if (currentIndex >= 0 && currentIndex < difficulty.length - 1) {
      return difficulty[currentIndex + 1]; // Returns the next level
    }
    return null; // No next level
  };
  const assignmentCache = useRef({}); // Store fetched data without re-rendering

  const HandleSetDifficulty = useCallback(level => {
    setCurrentQuestionIndex(0);
    setDifficultyInfo(level);
    const existsLevel = checkExistsLevel(level);
    if (!existsLevel) {
      if (assignmentCache.current[level]) {
        // Use cached data directly
        setCurrentQuiz([...assignmentCache.current[level]]);
      } else {
        // Fetch data and store it in cache
        getAssignment(assignmentType, level);
      }
    } else {
      Alert.alert('You already passed this assignment level, try next levels');
      const nextLevel = getNextAvailableLevel(level);
      if (nextLevel) {
        setDifficultyInfo(nextLevel);
        if (assignmentCache.current[nextLevel]) {
          setCurrentQuiz([...assignmentCache.current[nextLevel]]);
        } else {
          getAssignment(assignmentType, nextLevel);
        }
      } else {
        Alert.alert('Congratulations! You have completed all levels.');
      }
    }
  }, []); // No need for dependency on assignmentCache
  const getAssignment = useCallback(async (ChallengeTopic, level) => {
    try {
      const res = await axios.get(
        `${functionApi}/Assignment/getAssignments/${ChallengeTopic}`,
      );
      if (res.data) {
        const {easy, medium, hard} = res.data;
        let data = [];
        switch (level) {
          case 'easy':
            data = [...easy];
            break;
          case 'medium':
            data = [...medium];
            break;
          case 'hard':
            data = [...hard];
            break;
          default:
            return;
        }
        setCurrentQuiz(data);
        assignmentCache.current[level] = data; // Store in cache without causing re-render
      }
    } catch (err) {
      setError('Failed to load challenges. Please try again.');
    }
  }, []); // No unnecessary re-renders
  useEffect(() => {
    const unfinishedLevel = difficulty.find(level => !checkExistsLevel(level));
    if (unfinishedLevel) {
      setDifficultyInfo(unfinishedLevel); // Set the difficultyInfo to the first unfinished level
      getAssignment(assignmentType, unfinishedLevel);
    } else {
      Alert.alert('You have completed all assignment levels!');
    }
  }, [assignmentType, getAssignment]); // Added assignmentType to dependencies

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(currentQuiz?.length).fill(null),
  );

  const handleOptionSelect = useCallback(
    option => {
      const updatedAnswers = [...selectedAnswers];
      updatedAnswers[currentQuestionIndex] = option;
      setSelectedAnswers(updatedAnswers);
    },
    [currentQuestionIndex, selectedAnswers],
  );
  // const submit assignmenet and check answer
  const checkAnswers = useCallback(async () => {
    // Ad was shown successfully, proceed with checking answers
    let score = 0;
    currentQuiz?.forEach((item, index) => {
      if (item.answer === selectedAnswers[index]) {
        score += 1;
      }
    });

    const passingScore = difficultyInfo.toLowerCase() === 'easy' ? 5 : 15;
    if (score < passingScore || score === 0) {
      Alert.alert(`Try Again!, You did not pass. Score: ${score}`);
      setCurrentQuestionIndex(0);
      return;
    }
    try {
      const res = await axios.post(
        `${functionApi}/Assignment/saveAssignment/${user?._id}`,
        {
          AssignmentType: assignmentType,
          point: score,
          level: difficultyInfo,
        },
      );
      if (res.status === 200) {
        setUser(prev => ({...prev, Assignments: res.data.Assignments}));
        Alert.alert(`You passed. Score: ${score}`);
        setCurrentQuestionIndex(0);
        try {
          Actitivity(
            user?._id,
            `Finished ${difficultyInfo} Level ${assignmentType} assignment`,
          );
        } catch (error) {}
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong while submitting your assignment. Please try again.',
      );
    }
  }, [currentQuiz, selectedAnswers, difficultyInfo, assignmentType, user]);
  // go next question
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuiz?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    addCount.current += 1;
    if (addCount.current % 5 === 0) {
      if (isLoaded) {
        show();
      }
    }
  }, [isLoaded, addCount, currentQuestionIndex]);
  // go previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  // custom radio button
  const CustomRadioButton = ({option, isSelected, onSelect}) => (
    <TouchableOpacity
      onPress={() => onSelect(option)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 14,
        backgroundColor: isSelected ? Colors.veryLightGrey : 'white',
        borderColor: Colors.veryLightGrey,
        borderWidth: 1,
        borderRadius: 5,
        // elevation: 2,
      }}>
      <Text
        style={{
          color: Colors.mildGrey,
          flexShrink: 1,
          fontSize: width * 0.034,
          letterSpacing: 0.5,
          fontFamily: Font.Regular,
        }}>
        {option}
      </Text>
    </TouchableOpacity>
  );
  // main wrapper
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Assignment playground" />
      </View>
      <View style={{paddingHorizontal: 15}}>
        <PragraphText text={'Choose Difficulty'} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}>
        {difficulty.map(item => (
          <Text
            key={item}
            onPress={() => HandleSetDifficulty(item)}
            style={{
              paddingHorizontal: width * 0.06,
              borderWidth: 0.5,
              paddingVertical: 10,
              borderRadius: 5,
              letterSpacing: 1,
              fontSize: width * 0.025,
              borderColor: Colors.lightGrey,
              fontFamily: Font.Regular,
            }}>
            {item.toUpperCase()}
          </Text>
        ))}
      </View>
      <Text
        style={{
          marginVertical: 10,
          paddingHorizontal: 15,
          color:
            difficultyInfo.toLowerCase() === 'easy'
              ? 'green'
              : difficultyInfo.toLowerCase() === 'medium'
              ? 'orange'
              : 'red',
          fontWeight: '700',
          letterSpacing: 1,
          fontFamily: Font.SemiBold,
        }}>
        {difficultyInfo.toUpperCase()}
      </Text>
      <View style={{paddingHorizontal: 15}}>
        <TopicsText
          text={
            assignmentType.toLowerCase() == 'js'
              ? 'Java script'
              : assignmentType.toUpperCase()
          }
          fszie={width * 0.06}
          mb={5}
        />
      </View>
      {currentQuiz ? (
        <View style={{marginTop: 10, paddingHorizontal: 15}}>
          <Text
            style={{
              fontSize: width * 0.045,
              lineHeight: 30,
              letterSpacing: 1,
              fontFamily: Font.Regular,
            }}>
            {currentQuiz[currentQuestionIndex].question_id}.{' '}
            {currentQuiz[currentQuestionIndex].question}
          </Text>
          {currentQuiz[currentQuestionIndex].options.map((option, index) => (
            <CustomRadioButton
              key={index}
              option={option}
              isSelected={selectedAnswers[currentQuestionIndex] === option}
              onSelect={handleOptionSelect}
            />
          ))}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 20,
            }}>
            <Button
              color={Colors.mildGrey}
              title="Previous"
              onPress={previousQuestion}
              touchSoundDisabled={false}
              disabled={currentQuestionIndex === 0}
            />
            {currentQuestionIndex === currentQuiz?.length - 1 ? (
              <TouchableOpacity
                onPress={() => checkAnswers()}
                style={{
                  padding: 10,
                  backgroundColor: Colors.violet,
                  width: width * 0.3,
                }}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: 1,
                    textAlign: 'center',
                    fontFamily: Font.Regular,
                  }}>
                  Submit Quiz
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={nextQuestion}
                style={{
                  padding: 10,
                  backgroundColor: Colors.violet,
                  width: width * 0.2,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: 1,
                    textAlign: 'center',
                    fontFamily: Font.Regular,
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={{margin: 10, flexDirection: 'column', rowGap: 10}}>
          <Skeleton width={'100%'} height={20} radius={20} />
          <Skeleton width={'100%'} height={50} radius={20} />
          <Skeleton width={'100%'} height={30} radius={20} />
          <Skeleton width={'100%'} height={30} radius={20} />
          <Skeleton width={'100%'} height={30} radius={20} />
        </View>
      )}
    </View>
  );
};

export default AssignmentPlayGround;
