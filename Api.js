const Api = __DEV__
  ? 'http://192.168.168.90:8080'
  : 'https://codezackserver.onrender.com';
const SocketApi = __DEV__
  ? 'http://192.168.168.90:8080'
  : 'https://codezackserver.onrender.com';
const loginApi = __DEV__
  ? 'http://192.168.168.90:8080'
  : 'https://codezackserver.onrender.com';
const profileApi = __DEV__
  ? 'http://192.168.168.90:8080'
  : 'https://codezackserver.onrender.com';
const functionApi = __DEV__
  ? 'http://192.168.168.90:8080'
  : 'https://codezackserver.onrender.com';

// -----
module.exports = {Api, loginApi, SocketApi, profileApi, functionApi};
