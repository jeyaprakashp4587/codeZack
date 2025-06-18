import {ProductionAPIKEY, devKey} from '@env';

const baseURL = __DEV__ ? devKey : ProductionAPIKEY;

module.exports = {
  Api: baseURL,
  loginApi: baseURL,
  SocketApi: baseURL,
  profileApi: baseURL,
  functionApi: baseURL,
  challengesApi: baseURL,
};
