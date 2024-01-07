import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Profile = ({ user, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> {user?.name} </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Image
            borderRadius={"full"}
            src={user?.pic}
            alt={user?.name}
            boxSize={"200px"}
          />
          <Text
            fontFamily={"Work sans"}
            fontSize={{ base: "20px", md: "25px" }}
          >
            Email: {user?.email}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Profile;
