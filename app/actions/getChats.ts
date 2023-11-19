import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
//Acción que coge todos los chats que tiene abierto el usuario. También trae los datos de los usuarios y de los mensages del chat.
//TODO: Funcionalidad de chat grupal.
const getChats = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) return [];

  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return chats;
  } catch (error: any) {
    return [];
  }
};

export default getChats;
