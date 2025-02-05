const Api = !__DEV__
  ? 'http://ec2-51-20-40-32.eu-north-1.compute.amazonaws.com:8080'
  : 'http:192.168.60.90:8080';
const SocketApi = !__DEV__
  ? 'http://ec2-51-20-40-32.eu-north-1.compute.amazonaws.com:8080'
  : 'http:192.168.60.90:8080';
const loginApi = !__DEV__
  ? 'http://ec2-51-20-40-32.eu-north-1.compute.amazonaws.com:8080'
  : 'http:192.168.60.90:8080';
const profileApi = !__DEV__
  ? 'http://ec2-51-20-40-32.eu-north-1.compute.amazonaws.com:8080'
  : 'http:192.168.60.90:8080';
const functionApi = !__DEV__
  ? 'http://ec2-51-20-40-32.eu-north-1.compute.amazonaws.com:8080'
  : 'http:192.168.60.90:8080';
const challengesApi = !__DEV__
  ? 'http://ec2-51-20-40-32.eu-north-1.compute.amazonaws.com:8080'
  : 'http:192.168.60.90:8080';

// http:192.168.60.90:8080
// -----
module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
