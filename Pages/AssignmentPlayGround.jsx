import React, {useState, useMemo, useCallback, useEffect} from 'react';
import TopicsText from '../utils/TopicsText';
import Api from '../Api';
import {useData} from '../Context/Contexter';
import axios from 'axios';
import {
  View,
  Text,
  Button,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PragraphText from '../utils/PragraphText';
import {Colors} from '../constants/Colors';

const AssignmentPlayGround = () => {
  const {assignmentType, user, setUser} = useData();
  const {width, height} = Dimensions.get('window');
  const [currentQuiz, setCurrentQuiz] = useState();
  const difficulty = ['easy', 'medium', 'hard'];
  const [difficultyInfo, setDifficultyInfo] = useState('easy');

  const HandleSetDifficulty = level => {
    setDifficultyInfo(level);
    getAssignment(assignmentType, level);
    checkExistsLevel();
  };

  const checkExistsLevel = useCallback(
    level => {
      const findAssignment = user?.Assignments?.find(
        item =>
          item.AssignmentType.toLowerCase() == assignmentType.toLowerCase(),
      );
    },
    [user, difficultyInfo],
  );

  const getAssignment = useCallback(
    async (ChallengeTopic, level) => {
      try {
        const res = await axios.get(
          `${Api}/Assignment/getAssignments/${ChallengeTopic}`,
        );
        if (res.data) {
          const {easy, medium, hard} = res.data;
          switch (level) {
            case 'easy':
              setCurrentQuiz([...easy]);
              break;
            case 'medium':
              setCurrentQuiz([...medium]);
              break;
            case 'hard':
              setCurrentQuiz([...hard]);
              break;
          }
        }
      } catch (err) {
        setError('Failed to load challenges. Please try again.');
        console.error('Error fetching challenges:', err);
      }
    },
    [difficultyInfo],
  );

  useEffect(() => {
    getAssignment(assignmentType, 'easy');
  }, []);

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

  const checkAnswers = useCallback(async () => {
    let score = 0;
    currentQuiz?.forEach((item, index) => {
      if (item.answer === selectedAnswers[index]) {
        score += 1;
      }
    });

    if (
      score >=
        (difficultyInfo.toLowerCase() === 'easy'
          ? 8
          : difficultyInfo.toLowerCase() === 'medium'
          ? 15
          : 15) &&
      score != 0
    ) {
      const res = await axios.post(
        `${Api}/Assignment/saveAssignment/${user?._id}`,
        {AssignmentType: assignmentType, point: score, level: difficultyInfo},
      );
      if (res.data.Email) {
        setUser(res.data);
        Alert.alert('Congratulations!', 'You passed the quiz!');
      }
    } else {
      Alert.alert('Try Again!', `You did not pass. Score: ${score}`);
    }
  }, [selectedAnswers]);

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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
      <Text style={{color: Colors.mildGrey, flexShrink: 1}}>{option}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{padding: 20, backgroundColor: 'white', flex: 1}}>
      <TopicsText text={assignmentType.toUpperCase()} mb={5} />
      <PragraphText text={'Choose Difficulty'} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {difficulty.map(item => (
          <Text
            key={item}
            onPress={() => HandleSetDifficulty(item)}
            style={{
              paddingHorizontal: width * 0.06,
              borderWidth: 1,
              paddingVertical: 10,
              borderRadius: 5,
              letterSpacing: 1,
              fontSize: width * 0.025,
              borderColor: Colors.lightGrey,
            }}>
            {item.toUpperCase()}
          </Text>
        ))}
      </View>
      <Text
        style={{
          marginVertical: 10,
          color:
            difficultyInfo.toLowerCase() === 'easy'
              ? 'green'
              : difficultyInfo.toLowerCase() === 'medium'
              ? 'orange'
              : 'red',
        }}>
        {difficultyInfo.toUpperCase()}
      </Text>
      {currentQuiz && (
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: width * 0.05}}>
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
                onPress={checkAnswers}
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
                }}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: 1,
                    textAlign: 'center',
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default AssignmentPlayGround;
