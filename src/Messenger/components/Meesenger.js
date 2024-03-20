import React, { useRef, useState } from "react";
import Conversations from "./Conversations";
import Message from "./Message";
import ChatOnline from "./ChatOnline";
import { useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { conversations } from "../apis/conversation";
import { fetchMessages, sendMessages } from "../apis/messages";
import SearchUsers from "./SearchUsers";
import { Box, Text } from "@chakra-ui/react";
import { socket } from "../../utils/socketConnection";
import "../styles/messenger.css";

const Meesenger = () => {
  console.log("Meesenger loaded");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // const { user: userInfo } = ChatState();
  const [allConversation, setAllConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesRef = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllConversation();
    // socket.emit("addUser", userInfo._id);
    socket.emit("addUser", userInfo);

    socket.on("getUsers", (allOnlineUsers) => setOnlineUsers(allOnlineUsers));

    socket.on("getMessages", (newMessage) => {
      setArrivalMessage(newMessage);
      // setMessages((prev) => {
      //   return [...prev, newMessage];
      // });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      setMessages((prev) => {
        return [...prev, arrivalMessage];
      });
  }, [arrivalMessage]);

  const fetchAllConversation = async () => {
    const conversation = await conversations(userInfo?._id);
    if (conversation.data.success) {
      setAllConversation(conversation.data.data.conversation);
    } else {
      setAllConversation([]);
    }
  };

  useEffect(() => {
    fetchAllMessagesOfAChat();
  }, [currentChat]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetchAllMessagesOfAChat = async () => {
    if (!!currentChat) {
      try {
        const { data } = await fetchMessages(currentChat._id);
        if (data.success) {
          setMessages(data.data.messages);
        }
      } catch (error) {
        console.log("error while fetching messages : ", error);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessages.trim()) return;

    const message = {
      conversationId: currentChat._id,
      sender: userInfo._id,
      text: newMessages,
    };
    // find receiver id mean friend id.
    const receiverId = currentChat.members.find(
      (member) => !!member && member._id !== userInfo._id
    );
    try {
      socket.emit("sendMessage", {
        ...message,
        receiverId: receiverId._id,
        sender: userInfo,
      });
      const { data } = await sendMessages(message);

      if (data.success) {
        // setMessages([...messages, data.data.message]);
        setMessages((prev) => [...prev, data.data.message[0]]);
      }

      setNewMessages("");
    } catch (error) {
      console.log("error while sending message: " + error);
    }
  };

  const getUsers = () => {
    if (search) {
      let users =
        Array.isArray(allConversation) &&
        allConversation.filter((chat) => {
          const member =
            chat.members[0]._id === userInfo._id
              ? chat.members[1]
              : chat.members[0];

          return member.email.includes(search) || member.name.includes(search);
        });
      return users;
    } else {
      return allConversation;
    }
  };

  return (
    <div className="messenger">
      <Box
        borderRadius={"lg"}
        borderWidth={"1px"}
        //</div>style={{ background: "cadetblue", color: "white" }}
        bg={"teal"}
      >
        <SearchUsers />
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text p={5} fontSize="2xl">
            {!!userInfo && userInfo.name.toUpperCase()}
          </Text>
          <Text p={5} fontSize="2xl">
            {!!userInfo && userInfo.email}
          </Text>
        </Box>
      </Box>
      <div className="chat">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMenuInput"
              placeholder="Search Users"
              onChange={(event) => setSearch(event.target.value)}
            />
            {
              // Array.isArray(allConversation) &&
              // allConversation

              Array.isArray(getUsers()) &&
                getUsers().map((chat) => {
                  const friend = chat.members.filter(
                    (member) => member._id !== userInfo._id
                  );
                  return (
                    <div
                      key={chat._id}
                      onClick={() => {
                        setCurrentChat(chat);
                      }}
                      style={
                        currentChat
                          ? { background: "#dfd9d9f0", borderRadius: "10px" }
                          : {}
                      }
                    >
                      <Conversations friend={friend[0]} />
                    </div>
                  );
                })
            }
          </div>
        </div>

        <div className="chatBox">
          <div
            className="chatBoxWrapper"
            style={{
              backgroundColor: "#e9e0e040",
            }}
          >
            {currentChat ? (
              <React.Fragment>
                <div className="chatBoxTop">
                  {Array.isArray(messages) &&
                    messages.map((message, index) => {
                      return (
                        <div key={index} ref={messagesRef}>
                          <Message
                            own={userInfo?._id === message.sender._id}
                            message={message}
                          />
                        </div>
                      );
                    })}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Type your message..."
                    onChange={(e) => setNewMessages(e.target.value)}
                    value={newMessages}
                  />
                  <button
                    // type="submit"
                    className="chatMessageSubmit"
                    onClick={sendMessage}
                  >
                    Sent
                  </button>
                </div>
              </React.Fragment>
            ) : (
              <div className="noChat">Open a Conversation to start a chat.</div>
            )}
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {Array.isArray(onlineUsers) && onlineUsers.length > 0 ? (
              onlineUsers.map((usr) => {
                if (usr && userInfo._id !== usr?.user._id) {
                  return <ChatOnline key={usr?.user._id} usr={usr?.user} />;
                }
                return "";
              })
            ) : (
              <div>No Any online contacts</div>
            )}
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Meesenger;
