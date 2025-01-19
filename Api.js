const Api = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.168.90:8080';
const SocketApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'hhttp:192.168.168.90:8080';
const loginApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.168.90:8080';
const profileApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.168.90:8080';
const functionApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.168.90:8080';
const challengesApi = !__DEV__
  ? 'https://codezackserver.onrender.com'
  : 'http:192.168.168.90:8080';
// -----
module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
