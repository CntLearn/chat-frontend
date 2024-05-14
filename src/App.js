import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Chats, Home } from "./Pages";
import Meesenger from "./Messenger";
import Main from "./components/Main";
import { ChatState } from "./context/ChatProvider";
import "./App.css";

function App() {
  const localUser = JSON.parse(localStorage.getItem("userInfo"));
  const { user, setUser } = ChatState();
  const navigate = useNavigate();
  useEffect(() => {
    if (localUser) {
      setUser(localUser);
      navigate("/app");
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        {!!localUser && (
          <Route exact path="/app" element={<Main />}>
            <Route path="" element={<Chats />} />
            <Route path="messenger" element={<Meesenger />} />
          </Route>
        )}
        <Route path="*" element={<div>Not found page </div>} />
      </Routes>
    </div>
  );
}

export default App;
