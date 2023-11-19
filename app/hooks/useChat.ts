import { useParams } from "next/navigation";
import { useMemo } from "react";

//Hook custom para comprobar que una conversación está abierta o no.
//useParams es un hook de next para usar los parametros/queries de la url
const useChat = () => {
  const params = useParams();
  const chatId = useMemo(() => {
    if (!params?.chatId) return "";
    return params.chatId as string;
  }, [params?.chatId]);

  const isOpen = useMemo(() => !!chatId, [chatId]);

  return useMemo(
    () => ({
      isOpen,
      chatId,
    }),
    [isOpen, chatId]
  );
};

export default useChat;
