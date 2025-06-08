import React, {useEffect, useState} from 'react';
import {Dimensions, Text} from 'react-native';
import moment from 'moment';
import {Colors} from '../constants/Colors';
import {Font} from '../constants/Font';

const RelativeTime = ({time, fsize}) => {
  const [relativeTime, setRelativeTime] = useState('');
  const {width} = Dimensions.get('window');

  useEffect(() => {
    const updateRelativeTime = () => {
      if (time) {
        // Check if time is a valid date
        const isValidTime = moment(time, moment.ISO_8601, true).isValid();
        if (isValidTime) {
          const formattedTime = moment(time).fromNow();
          setRelativeTime(formattedTime);
        } else {
          setRelativeTime('Invalid time');
        }
      } else {
        setRelativeTime('Time not available');
      }
    };

    updateRelativeTime(); // Set initial relative time
    const intervalId = setInterval(updateRelativeTime, 60000); // Update every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [time]);

  return (
    <Text
      style={{
        fontSize: fsize ? fsize : width * 0.03,
        color: Colors.mildGrey,
        fontFamily: Font.Regular,
      }}>
      {relativeTime}
    </Text>
  );
};

export default RelativeTime;
