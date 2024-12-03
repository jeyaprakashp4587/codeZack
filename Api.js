//
const dev = true;
// 192.168.168.90
const Api = dev
  ? 'http://192.168.192.90:8080'
  : 'https://codecampusserver-r6gw.onrender.com';
const SocketApi = dev
  ? 'http://192.168.192.90:8080'
  : 'https://codecampusserversocket.onrender.com';
const loginApi = dev
  ? 'http://192.168.192.90:8080'
  : 'https://codecampusserverlogin.onrender.com';
const profileApi = dev
  ? 'http://192.168.192.90:8080'
  : 'https://codecampusserverprofile.onrender.com';
const functionApi = dev
  ? 'http://192.168.192.90:8080'
  : 'https://codecampusserverfunctions.onrender.com';

// export api
module.exports = {Api, SocketApi, profileApi, functionApi, loginApi};
// https://codecampusserver-r6gw.onrender.com http://192.
