const Api = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.43.90:8080';
const SocketApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.43.90:8080';
const loginApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.43.90:8080';
const profileApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.43.90:8080';
const functionApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.43.90:8080';
const challengesApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.43.90:8080';

// aws api key
console.log(!__DEV__ ? 'render' : 'aws');

// http:192.168.43.90:8080
// -----
http: module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
