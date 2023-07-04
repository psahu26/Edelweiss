import  { useEffect } from "react";
import { setData } from "../redux/dataPacket";
import { useDispatch } from "react-redux";

export const WebSocketConnection = () => {
    const dispatch = useDispatch()
  useEffect(() => {
    // Create a new WebSocket connection
    const socket = new WebSocket("ws://localhost:3000");

    // Connection opened
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    // Listen for messages
    socket.onmessage = (event) => {
      const receivedData = event.data;
        dispatch(setData(JSON.parse(receivedData)))
    };

    // Connection closed
    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    // Clean up the WebSocket connection
    return () => {
      socket.close();
    };
  }, [dispatch]);

  return (
    <div>
    </div>
  );
};

