export const getChatName = (logged, users) => {
  // if 1 logged display 2, and vice versa
  return logged._id === users[0]._id ? users[1].name : users[0].name;
};

export const getChatNameFull = (logged, users) => {
  // if 1 logged display 2, and vice versa
  if (!users) return;
  else return logged._id === users[0]._id ? users[1] : users[0];
};

export const isSameSender = (messages, index, currentMessage, userId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].senderId._id !== currentMessage.senderId._id ||
      messages[index + 1].senderId === undefined) &&
    messages[index].senderId._id !== userId
  );
};

export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].senderId._id !== userId &&
    messages[messages.length - 1].senderId._id
  );
};

export const isSameSenderMargin = (messages, index, currentMessage, userId) => {
  if (
    index < messages.length - 1 &&
    -1 &&
    messages[index + 1].senderId._id === currentMessage.senderId._id &&
    messages[index].senderId._id !== userId
  )
    return 33;
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].senderId._id !== currentMessage.senderId._id &&
      messages[index].senderId._id !== userId) ||
    (index === messages.length - 1 && messages[index].senderId._id !== userId)
  ) {
    return 0;
  } else {
    // return "auto";
    return 0;
  }
};
export const isSameUser = (messages, index, currentMessage) => {
  return (
    index > 0 &&
    messages[index - 1].senderId._id === currentMessage.senderId._id
  );
};
