import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const ENDPOINT = import.meta.env.VITE_APP_ENDPOINT;

const MyComponent = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText) {
      socket.current?.emit("chatMessage", inputText);
      setInputText("");
    }
  };

  useEffect(() => {
    const socketClient = socketIOClient(ENDPOINT);
    socket.current = socketClient;

    socket.current?.on("chatMessage", (data) => {
      setMessages((old) => [...old, data]);
      window.scrollTo(0, document.body.scrollHeight);
    });

    return () => {
      // Disconnect socket.current? when component unmounts
      socket.current?.disconnect();
    };
  }, []);

  return (
    // Your component JSX
    <div>
      <ul id="messages">
        {messages.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          id="input"
          autoComplete="off"
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default MyComponent;
