import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
//Accion que coge el ID del Chat y lo devuelve. También devuelve los datos del usuario participante.
//TODO: Si hay tiempo hacer una funcionalidad para chat grupales. Habrá que cambiar esto.
const getChatById = async (chatId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });

    return chat;
  } catch (error: any) {
    console.log(error, "SERVER_ERROR");
    return null;
  }
};

export default getChatById;
