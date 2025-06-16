import {APIKEY} from '@env';
const Api = !__DEV__ ? `${APIKEY}` : 'http://192.168.43.90:8080';
const SocketApi = !__DEV__ ? `${APIKEY}` : 'http://192.168.43.90:8080';
const loginApi = !__DEV__ ? `${APIKEY}` : 'http://192.168.43.90:8080';
const profileApi = !__DEV__ ? `${APIKEY}` : 'http://192.168.43.90:8080';
const functionApi = !__DEV__ ? `${APIKEY}` : 'http://192.168.43.90:8080';
const challengesApi = !__DEV__ ? `${APIKEY}` : 'http://192.168.43.90:8080';
// -----
module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
