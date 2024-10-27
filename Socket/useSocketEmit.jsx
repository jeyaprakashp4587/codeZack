import React, {useCallback} from 'react';

const useSocketEmit = socket => {
  const emitEvent = useCallback(
    (eventName, data) => {
      if (socket && eventName && data) {
        socket.emit(eventName, data);
      }
    },
    [socket],
  );

  return emitEvent;
};

export default useSocketEmit;
