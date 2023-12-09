"use client";

import useChat from "@/app/hooks/useChat";
import { MessageType } from "@/app/types";
import { useRef, useState, useEffect } from "react";
import { MessageBox } from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";
//Componente que contiene los mensajes del chat.
interface BodyProps {
  initialMessages: MessageType[];
}
//messages se mapea para sacar todos los mensajes
//MessageBox es el componente para la caja de los mensajes
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const { chatId } = useChat();
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/chats/${chatId}/seen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, [chatId]);

  useEffect(() => {
    pusherClient.subscribe(chatId);
    botRef?.current?.scrollIntoView();

    const messageHandler = (message: MessageType) => {
      fetch(`/api/chats/${chatId}/seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessages((current) => {
        if (current.find((item) => item.id === message.id)) {
          return current;
        }
        return [...current, message];
      });

      botRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: MessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
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
      <div ref={botRef} className="pt-24" />
    </div>
  );
};

export default Body;
