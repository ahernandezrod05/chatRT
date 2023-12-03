import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface Params {
  chatId?: string;
}
//Endpoint que elimina un chat. Comprobamos qeu el usuario y el chat existan primero, después se borra.
//Se comprueba que el usuario esté en el chat para que no pueda eliminarlo personas ajenas al chat.
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { chatId } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Usuario no autorizado", { status: 401 });

    const chatExists = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });

    if (!chatExists)
      return new NextResponse("No existe ID del chat", { status: 400 });

    const deletedChat = await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    return NextResponse.json(deletedChat);
  } catch (error: any) {
    console.log("Error al borrar un chat", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
}
