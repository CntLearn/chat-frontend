import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { getChatName, getChatNameFull } from "../../config/chatLogics";
import Profile from "./Profile";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import { API_BASE_URL } from "../../consts";
import "./singleChat.css";
import io from "socket.io-client";

let socket = "",
  selectedChatCompare = "";

const API_END_POINT = "http://localhost:5000";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // message
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, SetNewMessage] = useState("");
  const [socketConnected, SetSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(API_END_POINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log("connection established");
      SetSocketConnected(true);
    });

    //
    socket.on("typing", () => {
      setIsTyping(() => true);
    });

    socket.on("stop typing", () => {
      setIsTyping(() => false);
    });
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("received message", newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chatId._id
      ) {
        // it means that message is to an other chat, send notification
        if (!notification.find((msg) => msg._id === newMessageReceived._id)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setLoading(true);
        const config = {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        };
        const message = {
          message: newMessage,
          chatId: selectedChat._id,
        };
        const { data } = await axios.post(
          `${API_BASE_URL}/messages`,
          message,
          config
        );
        socket.emit("send message", data.data.message);
        setMessages([...messages, data.data.message]);
        setLoading(false);
        SetNewMessage("");
      } catch (error) {
        console.log("user error : ", error);
        toast({
          title: "Message Send",
          description: error.message || "Server error occurred",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
    }
  };

  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_BASE_URL}/messages/${selectedChat._id}`,
        config
      );
      setMessages(data.data.messages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log("user error : ", error);
      toast({
        title: "Message Fetching",
        description: error.message || "Server error occurred",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const typingHandler = (event) => {
    SetNewMessage(event.target.value);

    if (!socketConnected) return;

    // typing indicator
    if (!typing) {
      setTyping(() => true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();

    let timer = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(() => false);
      }
    }, timer);
  };

  return (
    <React.Fragment>
      <Profile
        user={getChatNameFull(user, selectedChat.users)}
        isOpen={isOpen}
        onClose={onClose}
      />
      {selectedChat ? (
        <React.Fragment>
          <Text
            fontSize={{ base: "24px", md: "28px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat && selectedChat.isGroup ? (
              selectedChat.name.toUpperCase()
            ) : (
              <React.Fragment>
                {getChatName(user, selectedChat.users)}
                <Profile user={getChatNameFull(user, selectedChat.users)} />
              </React.Fragment>
            )}
            {
              //this is for single chat view button
              !selectedChat.isGroup && (
                <IconButton icon={<ViewIcon />} onClick={onOpen} />
              )
            }
            {
              // this is view for the group chat.
              selectedChat.isGroup && (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllMessages={fetchAllMessages}
                />
              )
            }
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidder"}
            bg={"#E8E8E8"}
            p={3}
            justifyContent={"flex-end"}
          >
            {
              // messages
              loading ? (
                <Spinner margin={"auto"} size={"xl"} w={20} h={20} />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )
            }
            <FormControl isRequired mt={3} onKeyDown={sendMessage}>
              {isTyping && <div>Typing...</div>}

              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter Message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </React.Fragment>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"}>Click on a user to start chat.</Text>
        </Box>
      )}
    </React.Fragment>
  );
};

export default SingleChat;
