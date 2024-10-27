import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Api from '../Api';

const Actitivity = async (userId, ActivityName) => {
  const date = moment().format('YYYY-MM-DD');
  const res = await axios.post(`${Api}/Activity/setActitvity/${userId}`, {
    ActivityName: ActivityName,
    Date: date,
  });
};

export default Actitivity;
