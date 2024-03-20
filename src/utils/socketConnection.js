// in chat am importing like this.
import io from "socket.io-client";

// in messenger.
// import { io } from "socket.io-client";

const API_END_POINT = "http://localhost:5000";
export const socket = io(API_END_POINT);
