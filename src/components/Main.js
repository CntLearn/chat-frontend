import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const Main = () => {
  const [chatActive, setChatActive] = useState(false);
  const [mesActive, setMesActive] = useState(false);
  return (
    <div>
      <Box p={2} display={"flex"} justifyContent={"center"}>
        <NavLink
          to={`/app`}
          style={({ isActive }) => {
            setChatActive(isActive);
            setMesActive(!isActive);
          }}
        >
          <Button colorScheme="teal" size="lg" isDisabled={chatActive}>
            Chat
          </Button>
        </NavLink>

        <NavLink
          to={`/app/messenger`}
          className={({ isActive }) => {
            setMesActive(isActive);
            setChatActive(!isActive);
          }}
        >
          <Button colorScheme="teal" size="lg" ml={2} isDisabled={mesActive}>
            Messenger
          </Button>
        </NavLink>
      </Box>
      {
        // Outlet is to navigate to the child routes that are defined in the parent app component.
        // it would be not render these child routes if not defined
      }
      <Outlet />
    </div>
  );
};

export default Main;
