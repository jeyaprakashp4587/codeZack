const Api = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http://192.168.43.90:8080';
const SocketApi = !__DEV__
  ? 'https://codezackserver2-1yev.onrender.com'
  : 'http://192.168.43.90:8800';
const loginApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http://192.168.43.90:8080';
const profileApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http://192.168.43.90:8080';
const functionApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http://192.168.43.90:8080';
const challengesApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http://192.168.43.90:8080';

// -----
module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
