import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {functionApi} from '../Api';

const Actitivity = async (userId, ActivityName) => {
  const date = moment().format('YYYY-MM-DD');
  const res = await axios.post(
    `${functionApi}/Activity/setActitvity/${userId}`,
    {
      ActivityName: ActivityName,
      Date: date,
    },
  );
};

export default Actitivity;
