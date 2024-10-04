import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client"; // Import the io function

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://localhost:8080"), []); // Include http:// for the URL

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
