import { Chat, Message, User } from "@prisma/client";
//Tipos necesarios para algunos componentes, ya que necesito más datos de los que el tipo de prisma trae,
//Si no hiciera esto estaría dando error
export type MessageType = Message & {
  sender: User;
  seen: User[];
};

export type ChatType = Chat & {
  users: User[];
  messages: MessageType[];
};
