import React from "react";
import { format } from "timeago.js";
// import { format, render, cancel, register } from 'timeago.js';
import pic from "../../assets/background.png";
import "../styles/message.css";
import { Avatar } from "@chakra-ui/react";
const Message = ({ own, message }) => {
  console.log("Message", message);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {
          // <img className="messageImg" src={pic} />
        }
        <Avatar
          size={"sm"}
          mr={2}
          name={message.sender.name}
          cursor={"pointer"}
          src={message.sender.pic}
          alt={message.sender.name}
        />
        <p className="messageText">{message.text || ""}</p>
      </div>
      <div className="messageBottom"> {format(message.createdAt)} </div>
    </div>
  );
};

export default Message;
