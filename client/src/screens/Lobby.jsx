import React, { useCallback, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const emailRef = useRef();
  const roomRef = useRef();
  const socket = useSocket();
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const email = emailRef.current.value;
      const room = roomRef.current.value;

      // Emit the join room event
      socket.emit("room:join", { email, room });

      // Optionally, clear the input fields after submission
      emailRef.current.value = "";
      roomRef.current.value = "";
    },
    [socket]
  ); // Make sure to include socket in the dependencies

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      console.log(email, room);
      navigate(`/room/${room}`); // Use navigate here to change the route
    },
    [navigate] // Include navigate in the dependencies
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom); // Clean up the event listener
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          ref={emailRef}
          style={{ display: "block" }}
          required // Optional: make the field required
        />
        <label htmlFor="room">Room ID</label>
        <input
          type="text"
          id="room"
          ref={roomRef}
          required // Optional: make the field required
        />
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Lobby;
