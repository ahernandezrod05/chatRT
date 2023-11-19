"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Chat, Message, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { ChatType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
//Componente que llena la barra lateral con los chats abiertos.
//TODO: Arreglar el isSeen para que funcione mejor.
interface ChatBoxProps {
  data: ChatType;
  selected?: boolean;
}
//Aquí s eusa hooks para ayudar en el rendering de la página. memoizing/guardando en cache varias variables
//Como los usuarios que no somos nosotros de los chats, o el cambiar de chat abierto.
const ChatBox: React.FC<ChatBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();
  //Hay que pasar el router como dependencia cuando se usa en los hooks.
  const handleClick = useCallback(() => {
    router.push(`/chats/${data.id}`);
  }, [data.id, router]);

  //Muestra el último mensaje del chat. con useMemo se guarda el valor en la cache hasta que el valor pasado en el array de dependencias cambie
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  //email del usuario.
  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  //Mensaje debajo del chat abierto.
  const lastMessageText = useMemo(() => {
    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Ha empezado a chatear!";
  }, [lastMessage]);

  //Fecha del último mensaje formateada
  // Convierte una fecha en Milisegundos a una estilo DD-MM-YYYY, short = nombre del mes 3 letras
  const formattedDate = new Date(lastMessage?.createdAt).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
  //Si el último mensaje ha sido visto.
  //No quería ponerlo, pero sino se hace dificil de leer y ver cuando tienes un mensaje nuevo.
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);
  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
    w-full 
    relative 
    flex 
    items-center 
    space-x-3 
    p-3 
    hover:bg-neutral-100
    rounded-lg
    transition
    cursor-pointer
    `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
              >
                {formattedDate}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate 
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
