import prisma from "@/app/libs/prismadb";
//Acción para coger todos los mensajes de un chat. incluye los datos del emisor/usuario que evnia el mensaje.

const getMessages = async (chatId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatIds: chatId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
