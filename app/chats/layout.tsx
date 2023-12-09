import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatsList from "./components/ChatsList";
import getChats from "../actions/getChats";
import getUsers from "../actions/getUsers";
//Layout del chat. Tiene el componente de la barra lateral, la lista de chats abiertos.
//Initial chats son los chats que se le pasa al principio.
//TODO: Hacer que la lista se actualice en tiempo real.
const ChatsLayout = async ({ children }: { children: React.ReactNode }) => {
  const chats = await getChats();
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <ChatsList initialChats={chats} users={users} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ChatsLayout;
