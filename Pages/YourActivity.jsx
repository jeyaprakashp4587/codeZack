import React, {useEffect, useState, useCallback} from 'react';
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {Colors, pageView} from '../constants/Colors';
import HeadingText from '../utils/HeadingText';
import HrLine from '../utils/HrLine';
import {Calendar} from 'react-native-calendars';
import {useData} from '../Context/Contexter';
import {functionApi} from '../Api';
import axios from 'axios';
import TopicsText from '../utils/TopicsText';
import moment from 'moment';
import Skeleton from '../Skeletons/Skeleton';
import BannerAdd from '../Adds/BannerAdd';
import {useNavigation} from '@react-navigation/native';

const YourActivity = () => {
  const {width, height} = Dimensions.get('window');
  const {user} = useData();
  const Navigation = useNavigation();
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      getAllActivityDates();
      getParticularDateActivities(moment().format('YYYY-MM-DD'));
    });
  }, []);
  useEffect(() => {
    Navigation.addListener('focus', () => {
      getAllActivityDates();
      getParticularDateActivities(moment().format('YYYY-MM-DD'));
    });
    return () => {
      Navigation.addListener('blur', () => null);
    };
  }, [Navigation]);

  // state to store activity dates and activities list
  const [dates, setDates] = useState({});
  const [activitiesList, setActivitiesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch all activity dates
  const getAllActivityDates = async () => {
    try {
      const res = await axios.get(
        `${functionApi}/Activity/getAllActivityDates/${user?._id}`,
      );
      if (res.data) {
        setLoading(true);
        const markedDatesArray = res.data.map(date => ({
          [date]: {marked: true},
        }));
        const markedDates = Object.assign({}, ...markedDatesArray);
        setDates(markedDates);
      } else {
        setDates({});
      }
    } catch (error) {
      console.error('Error fetching activity dates:', error);
      Alert.alert('Error', 'Failed to fetch activity dates. Please try again.');
    }
  };

  // Fetch activities for a particular date
  const getParticularDateActivities = async date => {
    setSelectedDate(date);

    try {
      const res = await axios.post(
        `${functionApi}/Activity/getParticularDateActivities/${user?._id}`,
        {Date: date},
      );
      if (res.data) {
        setActivitiesList(res.data);
      } else {
        setActivitiesList([]);
      }
    } catch (error) {
      setActivitiesList([]);
    }
  };

  // Callback to handle date selection
  const selectedDateFun = useCallback(date => {
    getParticularDateActivities(date.dateString);
  }, []);
  // render skeleton
  const [loading, setLoading] = useState(false);
  if (!loading) {
    return (
      <View style={[pageView, {paddingHorizontal: 15}]}>
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.5} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
      </View>
    );
  }

  return (
    <View style={pageView}>
      <View style={{paddingHorizontal: 15}}>
        {/* heading text */}
        <HeadingText text="Your Activities" />
        {/* calender preview */}
        <Calendar
          style={{borderWidth: 0, width: '100%', height: 'auto'}}
          markedDates={dates}
          onDayPress={selectedDateFun}
        />
        {/* list Activities */}
        <HrLine width="100%" />
        <TopicsText text={selectedDate ? selectedDate : ''} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {activitiesList.length > 0 ? (
            activitiesList.map((item, index) => (
              <Text
                style={{
                  // borderWidth: 1,
                  padding: width * 0.03,
                  fontSize: width * 0.04,
                  color: Colors.white,
                  marginBottom: 20,
                  borderRadius: 5,
                  backgroundColor: Colors.violet,
                  letterSpacing: 1,
                }}
                key={index}>
                {index + 1}. {item.activityName}
              </Text>
            ))
          ) : (
            <Text style={{letterSpacing: 1, color: Colors.mildGrey}}>
              No Activities there in this date
            </Text>
          )}
        </ScrollView>
      </View>
      <BannerAdd />
    </View>
  );
};

export default React.memo(YourActivity);

const styles = StyleSheet.create({});
