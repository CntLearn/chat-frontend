import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { getChatName, getChatNameFull } from "../../config/chatLogics";
import Profile from "./Profile";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import useShowToast from "../useShowToast";
import { fetchMessages, sendMessageToUser } from "../../apis/chat/messages";
import aud from "../../videos/dock.mp3";
import { socket } from "../../utils/socketConnection";
import "./singleChat.css";

let selectedChatCompare = "";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ShowToast = useShowToast();

  // message
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, SetNewMessage] = useState("");
  const [socketConnected, SetSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // WORKING in a environment., in a environment...
  const test = () => {
    // buttonRef.current.click();
    // const audio = new Audio(aud);
    // const playPromise = audio.play();
    // if (playPromise !== undefined) {
    //   playPromise
    //     .then(() => {
    //       console.log("aaaaaaaaaaaa inner");
    //       // Audio started playing
    //     })
    //     .catch((error) => {
    //       console.error("Error playing audio:", error);
    //     });
    // }
    // audio.addEventListener("canplaythrough", () => {
    //   console.log("calling play on");
    //   audio
    //     .play()
    //     .then(() => {
    //       console.log("calling playing");
    //     })
    //     .catch((e) => {
    //       window.addEventListener(
    //         "click",
    //         () => {
    //           console.log("calling click on");
    //           audio.play();
    //         },
    //         { once: true }
    //       );
    //     });
    // });
  };

  const playAudio = () => {
    console.log("calling play audio ");

    // audioRef.current.addEventListener("canplaythrough", () => {
    //   console.log("calling play on");
    //   audioRef.current
    //     .play()
    //     .then(() => {
    //       console.log("calling playing");
    //     })
    //     .catch((e) => {
    //       window.addEventListener(
    //         "click",
    //         () => {
    //           console.log("calling click on");
    //           audioRef.current.play();
    //         },
    //         { once: true }
    //       );
    //     });
    // });

    // if (audioRef.current) {
    //   console.log("aaaaaaaaaaaa");

    //   audioRef.current.muted = true;

    //   const playPromise = audioRef.current.play();

    //   console.log("palysing audio", playPromise);

    //   if (playPromise !== undefined) {
    //     playPromise
    //       .then(() => {
    //         console.log("aaaaaaaaaaaa inner");
    //         // Audio started playing
    //       })
    //       .catch((error) => {
    //         console.error("Error playing audio:", error);
    //       });
    //   }
    // }
  };

  const autoClick = () => {
    if (buttonRef.current) {
      buttonRef.current.addEventListener("click", () => {
        console.log("auto click is supported");
      });
      buttonRef.current.click();
    }
  };

  useEffect(() => {
    // document.body.addEventListener("mouseover", function () {
    //   console.log("clicked");
    // });
    // document.body.addEventListener("click", function () {
    //   console.log("clicked");
    // });
    // document.body.addEventListener("mouseout", function () {
    //   console.log("mouseout");
    // });
    // document.body.addEventListener("focus", function () {
    //   console.log("focus");
    // });

    // socket = io(API_END_POINT);
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
    // socket.on("audio", () => {
    //   // isOpen();
    //   // test();
    //   // buttonRef.current.click();
    //   // buttonRef.current.addEventListener("click", playAudio);
    //   autoClick();
    //   playAudio();
    //   // buttonRef.current.click();
    // });
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

        const message = {
          message: newMessage,
          chatId: selectedChat._id,
        };
        const { data } = await sendMessageToUser(message);
        socket.emit("send message", data.data.message);
        setMessages([...messages, data.data.message]);
        setLoading(false);
        SetNewMessage("");
      } catch (error) {
        console.log("user error : ", error);
        ShowToast(
          "Message Send",
          error.message || "Server error occurred",
          "error"
        );

        setLoading(false);
      }
    }
  };

  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);

      const { data } = await fetchMessages(selectedChat._id);
      setMessages(data.data.messages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log("user error : ", error);
      ShowToast(
        "Message Fetching",
        error.message || "Server error occurred",
        "error"
      );

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
      {/*
        <iframe
        src={aud}
        allow="autoplay"
        style={{ display: "none" }}
        id="iframeAudio"
      ></iframe>
      <button style={{ display: "none" }} ref={buttonRef}>
        Play Audio
      </button>
      <audio
        style={{ display: "none" }}
        id="id"
        // autoPlay={"autoplay"}
        // autoPlay
        muted={"muted"}
        // muted
        ref={audioRef}
        controls
        preload="auto"
      >
        <source src={aud} type="audio/mpeg" />
      </audio>
        */}
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
