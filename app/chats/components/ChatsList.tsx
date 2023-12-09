"use client";
import useChat from "@/app/hooks/useChat";
import { ChatType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ChatBox from "./ChatBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
interface ChatListProps {
  initialChats: ChatType[];
  users: User[];
}

//Lista de todos los chats disponibles y los pone en la barra lateral
const ChatList: React.FC<ChatListProps> = ({ initialChats, users }) => {
  const [chats, setChats] = useState(initialChats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const router = useRouter();

  const { chatId, isOpen } = useChat();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (chat: ChatType) => {
      setChats((current) => {
        if (current.find((item) => item.id === chat.id)) {
          return current;
        }
        return [chat, ...current];
      });
    };

    const updateHandler = (chat: ChatType) => {
      setChats((current) =>
        current.map((currentChat) => {
          if (currentChat.id == chat.id) {
            return {
              ...currentChat,
              messages: chat.messages,
            };
          }

          return currentChat;
        })
      );
    };
    const deleteHandler = (chat: ChatType) => {
      setChats((current) => {
        return [...current.filter((item) => item.id !== chat.id)];
      });

      if (chatId == chat.id) router.push("/chats");
    };

    pusherClient.bind("chat:new", newHandler);
    pusherClient.bind("chat:update", updateHandler);
    pusherClient.bind("chat:delete", deleteHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("chat:new", newHandler);
      pusherClient.unbind("chat:update", updateHandler);
      pusherClient.unbind("chat:delete", deleteHandler);
    };
  }, [pusherKey, chatId, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <aside
        className={clsx(
          `
    fixed
    inset-y-0
    pb-20
    lg:pb-0
    lg:left-20
    lg:w-80
    lg:block
    overflow-y-auto
    border-r
    border-gray-200
    `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className=" flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Chats abiertos
            </div>
            <div
              className=" rounded-full p-2 bg-gray-100 text-gray-800 cursor-pointer hover:opacity-75 transition"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <MdOutlineGroupAdd size={25} />
            </div>
          </div>
          {chats.map((chat) => (
            <ChatBox key={chat.id} data={chat} selected={chat.id === chatId} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ChatList;
