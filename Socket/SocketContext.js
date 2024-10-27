import React, {createContext, useContext, useState} from 'react';
import useSocket from './useSocket';

const SocketContext = createContext();
export const SocketProvider = ({children}) => {
  const socket = useSocket();
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export const SocketData = () => useContext(SocketContext);
