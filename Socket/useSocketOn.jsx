import React, {useEffect} from 'react';

const useSocketOn = (socket, eventName, callback) => {
  useEffect(() => {
    if (socket) {
      socket.on(eventName, callback);
      // Clean up the listener
      return () => {
        socket.off(eventName, callback);
      };
    }
  }, [socket, eventName, callback]);
};

export default useSocketOn;
