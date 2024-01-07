import { useToast } from "@chakra-ui/react";

function useShowToast() {
  const toast = useToast();

  const ShowToast = (title, description, type) => {
    toast({
      title,
      description,
      status: type,
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  };

  return ShowToast;
}

export default useShowToast;
