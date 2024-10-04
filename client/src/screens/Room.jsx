import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import Peer from "../service/Peer";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null); // State for remote stream

  // Handle when a user joins the room
  const handleUserJoin = useCallback(({ email, id }) => {
    console.log("User joined:", { email, id });
    setRemoteSocketId(id);
  }, []);

  // Handle an incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from:", from);
      setRemoteSocketId(from);

      // Get the user's media stream if not already set
      if (!myStream) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        stream
          .getTracks()
          .forEach((track) => Peer.peer.addTrack(track, stream));
      }

      const answer = await Peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [myStream, socket]
  );

  // Make a call to the remote user
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    stream.getTracks().forEach((track) => Peer.peer.addTrack(track, stream));

    const offer = await Peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [socket, remoteSocketId]);

  const handleCallAccepted = useCallback(async ({ from, answer }) => {
    console.log("Call accepted by:", from);
    await Peer.setLocalDescription(answer);
  }, []);

  useEffect(() => {
    Peer.peer.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream); // Set the remote stream when received
    };
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:joined", handleUserJoin);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoin, handleIncomingCall, handleCallAccepted]);

  return (
    <div>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && (
        <ReactPlayer
          height="100px"
          width="200px"
          playing
          muted // Mute local playback to avoid echo
          url={myStream}
        />
      )}
      {/* Remote Stream */}
      {remoteStream && (
        <div>
          <h4>Remote Stream:</h4>
          <ReactPlayer
            height="100px"
            width="200px"
            playing
            url={remoteStream}
          />
        </div>
      )}
    </div>
  );
};

export default Room;
