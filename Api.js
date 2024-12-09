const Api = __DEV__
  ? 'http://192.168.36.90:8080'
  : 'https://codezackfunctionserver-1.onrender.com';
const SocketApi = __DEV__
  ? 'http://192.168.36.90:8080'
  : 'https://codezackfunctionserver-1.onrender.com';
const loginApi = __DEV__
  ? 'http://192.168.36.90:8080'
  : 'https://codezackfunctionserver-1.onrender.com';
const profileApi = __DEV__
  ? 'http://192.168.36.90:8080'
  : 'https://codezackfunctionserver-1.onrender.com';
const functionApi = __DEV__
  ? 'http://192.168.36.90:8080'
  : 'https://codezackfunctionserver-1.onrender.com';

// -----
module.exports = {Api, loginApi, SocketApi, profileApi, functionApi};
