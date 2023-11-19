import getChatById from "@/app/actions/getChatById";
import getMessages from "@/app/actions/getMessages";
import React from "react";
import Header from "./components/Header";
import NoChatSelected from "@/app/components/NoChatSelected";
import Body from "./components/Body";
import MessageInput from "./components/MessageInput";

//Tipo del parámetro de la URL
interface Params {
  chatId: string;
}
//Página que muestra el chat seleccionado. chatId es el parámetro de la URL que coge el router de Next del navegador.
//uso las acciones de getChatById y getMessages para coger los datos. Si no hay chat seleccionado en la página
//Myuestra el componente de no chat seleccionado. Sino, muestra la página de los chats
const ChatId = async ({ params }: { params: Params }) => {
  const chat = await getChatById(params.chatId);
  const messages = await getMessages(params.chatId);

  if (!chat) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <NoChatSelected />
        </div>
      </div>
    );
  }
  //Header es un componente que tiene el usuario al que abre conversación.
  //Body tiene todos los chats. Initial messages son los mensajes de la BD cuando carga la página.
  //Message Input es un input que manda los mensajes.
  //Error de TypeScript todavía no identificado, por falta de tiempo y como todavía no afecta a nada se deja así.
  //TODO: Añadir mensajería en tiempo real.
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header chat={chat!} />
        <Body initialMessages={messages} />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatId;
