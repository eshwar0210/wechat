import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import "./chatmsg.css"
import { IoMdAttach } from "react-icons/io";
export default function ChatContainer({ currentchat, socket }) {
  // state variables
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // fill the messages array
  useEffect(() => {
    async function fetch() {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentchat._id,
      });
      setMessages(response.data);
    }
    fetch();
  }, [currentchat]);

  // sending message
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    // emit socket event
    socket.current.emit("send-msg", {
      to: currentchat._id,
      from: data._id,
      msg,
    });
    // post through api request
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentchat._id,
      message: msg,
    });
    // use spread operator to update messages
    const msgs = [...messages];
    // new message at end
    msgs.push({ fromSelf: true, message: msg });
    // update state variale of messages
    setMessages(msgs);

  };

  useEffect(() => {
    const handleMessageReceive = (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    };
  
    if (socket.current) {
      socket.current.on("msg-recieve", handleMessageReceive);
    }
  
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve", handleMessageReceive); // Cleanup
      }
    };
  }, [socket]);
  

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentchat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentchat.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages" >
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message.split('*', 2)[0]}</p>

                  <p className="time"> {(message.message.split('*', 2)[1])}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-container">
        <div className="input-container">
        <ChatInput handleSendMsg={handleSendMsg} />
        </div>  
        <label class="file-upload" title="send file">
          <input type="file" />
          <IoMdAttach />
        </label>
      </div>

    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10.09% 79.97% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    height: 95px;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 2rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    // background-image: url( "./bg.jpg");
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        // color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #1232ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
    .chat-container {
  display: flex;
  justify-content: space-between; /* Aligns items to the left and right */
  align-items: center; /* Vertically centers the items */
  width: 100%;
}
  .chat-container .input-container {
  flex-grow: 1; /* Chat input takes up remaining space */
}

.file-upload {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.file-upload input {
  display: none; /* Hide the default file input */
}

.file-upload svg {
  font-size: 1.8rem;
  color: white;
}

`;
