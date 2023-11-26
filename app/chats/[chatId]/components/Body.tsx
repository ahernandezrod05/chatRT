"use client";

import useChat from "@/app/hooks/useChat";
import { MessageType } from "@/app/types";
import { useRef, useState, useEffect } from "react";
import { MessageBox } from "./MessageBox";
//Componente que contiene los mensajes del chat.
interface BodyProps {
  initialMessages: MessageType[];
}
//messages se mapea para sacar todos los mensajes
//MessageBox es el componente para la caja de los mensajes
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const { chatId } = useChat();

  useEffect(() => {
    fetch(`/api/chats/${chatId}/seen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, [chatId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, idx) => (
        <MessageBox
          isLast={idx == messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" />
    </div>
  );
};

export default Body;
