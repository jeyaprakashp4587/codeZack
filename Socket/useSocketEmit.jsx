import React, {useCallback} from 'react';

const useSocketEmit = socket => {
  const emitEvent = useCallback(
    (eventName, data, callback) => {
      if (socket && eventName && data) {
        socket.emit(eventName, data, response => {
          if (callback) {
            callback(response);
          }
        });
      }
    },
    [socket],
  );

  return emitEvent;
};

export default useSocketEmit;
