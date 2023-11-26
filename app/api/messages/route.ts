import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
//Endpoint que añade un mensaje a un chat cada vez que se envía.
//TODO: Hacer que funcione en tiempo real.
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { message, image, chatId } = body;
    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Usuario no autorizado", { status: 401 });

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        chat: {
          connect: {
            id: chatId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updateChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log("Ha habido un error en /api/messages", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
