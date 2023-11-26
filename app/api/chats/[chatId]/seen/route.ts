import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface Params {
  chatId?: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const currentUser = await getCurrentUser();
    const { chatId } = params;

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Usuario no autorizado", { status: 401 });

    //Encuentra el chat actual
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!chat)
      return new NextResponse("No se encontró el chat", { status: 404 });

    //Consigo el último mensaje del chat
    const lastMessage = chat.messages[chat.messages.length - 1];

    if (!lastMessage) return NextResponse.json(chat);
    //Si existe lo actualizamos si existe para que esté a visto

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log("Error en api/chat/[chatId]/seen", error);
    return new NextResponse("Error en el servidor", { status: 500 });
  }
}
