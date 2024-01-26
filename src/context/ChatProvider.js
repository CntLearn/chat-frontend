import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./test.css";
import { Button, Text } from "@chakra-ui/react";
const ChatContext = createContext("");

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const [route, setRoute] = useState(false);

  const [notification, setNotification] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const path = history.location.pathname;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      !!history && history.push("/");
      setRoute(false);
    } else if (path.endsWith("/chats")) {
      moveHistory("/chats");
    } else if (path.endsWith("/messenger")) {
      // moveHistory("/messenger");
    }
  }, [history]);

  const moveHistory = (moveTo) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      !!history && history.push("/");
      setRoute(false);
    }
    if (moveTo === "/chats") {
      !!history && history.push("/chats");
      setUser(userInfo);
      setRoute(true);
    }
    if (moveTo === "/messenger") {
      !!history && history.push("/messenger");
      setUser(userInfo);
      setRoute(true);
    }
  };

  return (
    <React.Fragment>
      {
        //   !route ? (
        //   <div className="test">
        //     <Text fontSize={"3xl"}>Welcome to the Chat App and Messenger </Text>
        //     <br />
        //     <Text fontSize={"3xl"}>Click one of the Given Options</Text>
        //     <br />
        //     <div>
        //       <Button
        //         colorScheme="teal"
        //         onClick={() => moveHistory("/chats")}
        //         size="md"
        //       >
        //         {" "}
        //         Chat App{" "}
        //       </Button>
        //       <Button
        //         colorScheme="teal"
        //         onClick={() => moveHistory("/messenger")}
        //         ml={3}
        //         size="md"
        //       >
        //         Messenger
        //       </Button>
        //     </div>
        //   </div>
        // ) : (
      }
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          notification,
          setNotification,
        }}
      >
        {children}
      </ChatContext.Provider>
      {
        // )}
      }
    </React.Fragment>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
