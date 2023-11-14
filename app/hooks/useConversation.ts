import { useParams } from "next/navigation";
import { useMemo } from "react";

//Hook custom para comprobar que una conversación está abierta o no.
//useParams es un hook de next para usar los parametros/queries de la url
const useConversation = () => {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.conversationId) return "";
    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
