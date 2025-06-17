import {ProductionAPIKEY, devKey} from '@env';
const Api = !__DEV__ ? `${ProductionAPIKEY}` : `${devKey}`;
const SocketApi = !__DEV__ ? `${ProductionAPIKEY}` : `${devKey}`;
const loginApi = !__DEV__ ? `${ProductionAPIKEY}` : `${devKey}`;
const profileApi = !__DEV__ ? `${ProductionAPIKEY}` : `${devKey}`;
const functionApi = !__DEV__ ? `${ProductionAPIKEY}` : `${devKey}`;
const challengesApi = !__DEV__ ? `${ProductionAPIKEY}` : `${devKey}`;
// -----
module.exports = {
  Api,
  loginApi,
  SocketApi,
  profileApi,
  functionApi,
  challengesApi,
};
