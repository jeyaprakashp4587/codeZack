//
// 192.168.168.90
const Api = __DEV__
  ? 'http://192.168.189.90:8080'
  : 'https://codecampusserver-r6gw.onrender.com';
const SocketApi = __DEV__
  ? 'http://192.168.189.90:8080'
  : 'https://codecampusserversocket.onrender.com';
const loginApi = __DEV__
  ? 'http://192.168.189.90:8080'
  : 'https://codecampusserverlogin.onrender.com';
const profileApi = __DEV__
  ? 'http://192.168.189.90:8080'
  : 'https://codecampusserverprofile.onrender.com';
const functionApi = __DEV__
  ? 'http://192.168.189.90:8080'
  : 'https://codecampusserverfunctions.onrender.com';

// export api
module.exports = {Api, SocketApi, profileApi, functionApi, loginApi};
// https://codecampusserver-r6gw.onrender.com http://192.
