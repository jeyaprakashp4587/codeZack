import axios from 'axios';
import moment from 'moment';
import {functionApi} from '../Api';

const Actitivity = async (userId, ActivityName) => {
  try {
    // console.log(userId, ActivityName);
    const date = moment().format('YYYY-MM-DD');
    const {data} = await axios.post(
      `${functionApi}/Activity/setActivity/${userId}`,
      {
        ActivityName: ActivityName,
        Date: date,
      },
    );
    // console.log(data);
    // console.log('log from actiivty', userId, Actitivity);
  } catch (error) {
    console.log(error, 'on activity hook');
  }
};

export default Actitivity;
