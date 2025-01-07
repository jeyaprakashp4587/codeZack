import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Colors, pageView} from '../constants/Colors';
import Feather from 'react-native-vector-icons/Feather';
import HeadingText from '../utils/HeadingText';
import {useData} from '../Context/Contexter';
import AddWallet from '../hooks/AddWallet';
import axios from 'axios';
import {functionApi} from '../Api';

const Task = () => {
  const {user, setUser} = useData();
  // Memoized array of tasks with default Process as 'pending'
  const TasksData = useMemo(
    () => [
      {
        Content: `Claim Daily Check In for 15 Days`,
        Status: 'pending',
        Process: {
          endLine: 15,
          Process: user?.DailyCalimStreak,
        },
      },
      {
        Content: 'Enroll any 3 courses',
        Status: 'pending',
        Process: {
          endLine: 3,
          Process: user?.Courses?.length,
        },
      },
      {
        Content: 'Enroll 4 technologies',
        Status: 'pending',
        Process: {
          endLine: 4,
          Process: user?.Courses?.length,
        },
      },
      {
        Content: 'Spend 100 minutes in study area',
        Status: 'pending',
        Process: {
          endLine: 100,
          Process: user?.TotalStudyTime,
        },
      },
      {
        Content: 'Connect 20 friends with you',
        Status: 'pending',
        Process: {
          endLine: 20,
          Process: user?.Connections?.length,
        },
      },
      {
        Content: 'Complete 15 Challenges',
        Status: 'pending',
        Process: {
          endLine: 15,
          Process: user?.DailyCalimStreak,
        },
      },
      {
        Content: 'Complete & Pass 2 Assignments',
        Status: 'pending',
        Process: {
          endLine: 5,
          Process: user?.Assignments?.flatMap(assignMent =>
            assignMent.AssignmentLevel.filter(level => level.point >= 10),
          )?.length,
        },
      },
      {
        Content: 'Select one interview preparation and complete it',
        Status: 'pending',
        Process: {
          endLine: 1,
          Process: user?.InterView?.filter(comp => comp.currentWeek >= 6)
            ?.length,
        },
      },
    ],
    [], // No dependencies, so the array is only initialized once
  );
  console.log(user?.DailyCalimStreak);

  // Retrieve user data (assumed to contain information about the user's progress)

  // A boolean flag to determine if all validations pass
  let valid = true;

  // Function to validate all tasks based on user data
  const validAllTasks = () => {
    // check if user has claimed 15 days
    if (user?.DailyCalimStreak > 14) {
      TasksData[0].Status = 'completed';
    }
    // Check if the user has enrolled in at least 3 courses
    if (user?.Courses.length >= 3) {
      TasksData[1].Status = 'completed'; // Update task 2 to 'completed'
      TasksData[2].Status = 'completed'; // Update task 3 to 'completed'
    } else {
      valid = false; // Mark as invalid if the condition is not met
    }
    // check if user has reach study time of  task time
    if (user?.TotalStudyTime >= 100) {
      TasksData[3].Status = 'completed';
    } else {
      valid = false;
    }
    // Check if the user has completed at least 15 challenges
    if (user?.Challenges >= 15) {
      // Filter challenges to find those that are not 'pending'
      const completedChallenge = user?.Challenges?.filter(
        ch => ch?.Process !== 'pending',
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
  // refersh
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefresh(true);
    const res = await axios.post(`${functionApi}/Login/getUser`, {
      userId: user?._id,
    });
    if (res.data) {
      setRefresh(false);
      setUser(res.data);
    }
  }, []);
  // -----
  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        <HeadingText text="Tasks" />
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        style={{paddingHorizontal: 15, paddingTop: 20}}
        showsVerticalScrollIndicator={false}>
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
              borderWidth: 1,
              borderColor: 'white',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text style={{color: Colors.mildGrey, letterSpacing: 1.5}}>
                {item.Content}
              </Text>
              <Feather
                name="check-circle"
                size={20}
                color={item.Status == 'pending' ? Colors.lightGrey : 'green'}
              />
            </View>
            <Text style={{textAlign: 'right', letterSpacing: 2}}>
              {item.Process.Process}/
              <Text style={{color: Colors.violet, fontWeight: '600'}}>
                {item.Process.endLine}
              </Text>
            </Text>
          </View>
        ))}
        {/* claim button */}
        <TouchableOpacity
          onPress={handleClaimAward}
          style={{
            backgroundColor: Colors.violet,
            padding: 15,
            borderRadius: 5,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
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
