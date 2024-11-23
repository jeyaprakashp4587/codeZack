import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Colors, pageView} from '../constants/Colors';
import Feather from 'react-native-vector-icons/Feather';
import HeadingText from '../utils/HeadingText';
import {useData} from '../Context/Contexter';
import AddWallet from '../hooks/AddWallet';

const Task = () => {
  // Memoized array of tasks with default status as 'pending'
  const TasksData = useMemo(
    () => [
      {Content: 'Claim Daily Check In for 7 Days', Status: 'pending'},
      {Content: 'Enroll any 3 courses', Status: 'pending'},
      {Content: 'Enroll 4 technologies', Status: 'pending'},
      {Content: 'Spend 45 minutes in study area', Status: 'pending'},
      {Content: 'Connect 20 friends with you', Status: 'pending'},
      {Content: 'Complete 15 Challenges', Status: 'pending'},
      {Content: 'Complete & Pass 2 Assignments', Status: 'pending'},
      {
        Content: 'Select one interview preparation and complete it',
        Status: 'pending',
      },
    ],
    [], // No dependencies, so the array is only initialized once
  );

  // Retrieve user data (assumed to contain information about the user's progress)
  const {user, setUser} = useData();

  // A boolean flag to determine if all validations pass
  let valid = true;

  // Function to validate all tasks based on user data
  const validAllTasks = () => {
    // Check if the user has enrolled in at least 3 courses
    if (user?.Courses.length >= 3) {
      TasksData[1].Status = 'completed'; // Update task 2 to 'completed'
      TasksData[2].Status = 'completed'; // Update task 3 to 'completed'
    } else {
      valid = false; // Mark as invalid if the condition is not met
    }

    // Check if the user has completed at least 15 challenges
    if (user?.Challenges >= 15) {
      // Filter challenges to find those that are not 'pending'
      const completedChallenge = user?.Challenges?.filter(
        ch => ch?.status !== 'pending',
      );
      if (completedChallenge?.length >= 15) {
        TasksData[5].Status = 'completed'; // Update task 6 to 'completed'
      } else {
        valid = false;
      }
    } else {
      valid = false;
    }

    // Check if the user has connected with at least 20 friends
    if (user?.Connections?.length >= 20) {
      TasksData[4].Status = 'completed'; // Update task 5 to 'completed'
    } else {
      valid = false;
    }

    // Check if the user has completed at least one interview preparation
    if (user?.InterView) {
      // Find interviews where the current week is 6 or more
      const completedInterview = user?.InterView?.find(
        comp => comp?.currentWeek >= 6,
      );
      if (completedInterview) {
        TasksData[7].Status = 'completed'; // Update task 8 to 'completed'
      } else {
        valid = false;
      }
    } else {
      valid = false;
    }

    // Check if the user has completed at least one assignment with a level of 10 or more
    if (user?.Assignments?.length >= 1) {
      // Look for assignments where any level has a point >= 10
      const findFinishedAssignment = user?.Assignments?.flatMap(item =>
        item?.AssignmentLevel?.filter(point => point?.point >= 10),
      );
      if (findFinishedAssignment?.length > 1) {
        TasksData[6].Status = 'completed'; // Update task 7 to 'completed'
      } else {
        valid = false;
      }
    } else {
      valid = false;
    }
  };
  // check the valid in effect
  useEffect(() => {
    validAllTasks();
  }, []);
  // handleClaim
  const handleClaimAward = useCallback(async () => {
    if (!valid) {
      ToastAndroid.show('you must complete all tasks', ToastAndroid.SHORT);
    } else {
      try {
        await AddWallet(user?._id, 50, setUser);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  // -----
  return (
    <View style={pageView}>
      {/* BackGroung Image */}
      <Image
        source={{uri: 'https://i.ibb.co/qsbcvfy/rb-171636.png'}}
        style={{
          width: '90%',
          height: '90%',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      />
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Task" />
      </View>
      {/* text info */}
      <View style={{paddingHorizontal: 15, marginVertical: 15}}>
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 2,
            lineHeight: 30,
            fontWeight: '600',
          }}>
          Complete all tasks to earn a reward of ₹50.
        </Text>
      </View>
      {/* Task list */}
      <ScrollView style={{paddingHorizontal: 15}}>
        {TasksData.map((item, index) => (
          <View
            key={index}
            style={{
              borderWidth: 0,
              marginBottom: 15,
              padding: 15,
              elevation: 2,
              backgroundColor: 'white',
              borderRadius: 5,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: 'white',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: Colors.mildGrey, letterSpacing: 1.5}}>
              {item.Content}
            </Text>
            <Feather
              name="check-circle"
              size={20}
              color={item.Status == 'pending' ? Colors.veryDarkGrey : 'green'}
            />
          </View>
        ))}
        {/* claim button */}
        <TouchableOpacity
          onPress={handleClaimAward}
          style={{
            backgroundColor: Colors.violet,
            padding: 10,
            borderRadius: 5,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{textAlign: 'center', letterSpacing: 2, color: 'white'}}>
            Claim Reward
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({});
