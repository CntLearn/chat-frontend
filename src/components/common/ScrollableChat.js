import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  // isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  // ScrollableFeed package need to install and add here its component.
  return (
    <div>
      {Array.isArray(messages) &&
        messages.length > 0 &&
        messages.map((message, index) => {
          return (
            <div
              key={message._id}
              //   display={"flex"}
              style={{
                display: "flex",
                // marginTop: "10px",
                // float: message.senderId._id === user._id ? "right" : "left",
                // background:
                //   message.senderId._id === user._id ? "cadetblue" : "turquoise",
              }}
              //   borderRadius={"lg"}
              //   p={3}
              //   w={"70%"}
            >
              {(isSameSender(messages, index, message, user._id) ||
                isLastMessage(messages, index, user._id)) && (
                <Tooltip
                  label={message.senderId.name}
                  placement="bottom"
                  hasArrow
                >
                  <Avatar
                    name={message.senderId.name}
                    src={message.senderId.pic}
                    mt={"7px"}
                    cursor={"pointer"}
                    size={"sm"}
                    // mr={1}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor:
                    message.senderId._id === user._id ? "#BEE3F8" : "#B9F5D0",
                  borderRadius: "10px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  // marginLeft: isSameSenderMargin(
                  //   message,
                  //   index,
                  //   message,
                  //   user._id
                  // ),
                  marginLeft:
                    message.senderId._id !== user._id
                      ? isSameSender(messages, index, message, user._id) ||
                        isLastMessage(messages, index, user._id)
                        ? "10px"
                        : "40px"
                      : "auto",
                  marginTop: isSameUser(messages, index, message) ? 5 : 10,
                }}
              >
                {message.content}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default ScrollableChat;
