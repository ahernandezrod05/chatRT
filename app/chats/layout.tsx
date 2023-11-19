import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatsList from "./components/ChatsList";
import getChats from "../actions/getChats";
//Layout del chat. Tiene el componente de la barra lateral, la lista de chats abiertos.
//Initial chats son los chats que se le pasa al principio.
//TODO: Hacer que la lista se actualice en tiempo real.
const ChatsLayout = async ({ children }: { children: React.ReactNode }) => {
  const chats = await getChats();
  return (
    <Sidebar>
      <div className="h-full">
        <ChatsList initialChats={chats} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ChatsLayout;
