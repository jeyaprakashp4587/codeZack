const Api = !__DEV__
  ? 'http://ec2-50-16-176-155.compute-1.amazonaws.com:8080'
  : 'http://192.168.174.90:8080';
const SocketApi = !__DEV__
  ? 'http://ec2-50-16-176-155.compute-1.amazonaws.com:8080'
  : 'http://192.168.174.90:8080';
const loginApi = !__DEV__
  ? 'http://ec2-50-16-176-155.compute-1.amazonaws.com:8080'
  : 'http://192.168.174.90:8080';
const profileApi = !__DEV__
  ? 'http://ec2-50-16-176-155.compute-1.amazonaws.com:8080'
  : 'http://192.168.174.90:8080';
const functionApi = !__DEV__
  ? 'http://ec2-50-16-176-155.compute-1.amazonaws.com:8080'
  : 'http://192.168.174.90:8080';
const challengesApi = !__DEV__
  ? 'http://ec2-50-16-176-155.compute-1.amazonaws.com:8080'
  : 'http://192.168.174.90:8080';
// -----
module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
