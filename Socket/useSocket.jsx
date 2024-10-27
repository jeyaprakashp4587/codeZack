import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import Api from '../Api';
import {useData} from '../Context/Contexter';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const {user} = useData();

  useEffect(() => {
    if (!user || !user?._id) return; // Ensure user is available

    const newSocket = io(Api, {query: {userId: user?._id}});

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Clean up the socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]); // Re-run effect only if user._id changes

  return socket;
};

export default useSocket;
