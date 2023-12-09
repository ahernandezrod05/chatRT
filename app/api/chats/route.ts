import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
//Endpoint que mete en la base de datos el chat que se crea cuando clickamos a un usuario en la lista.
//TODO: Añadir funcionalidad de chat grupal
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, isGroup, members, name } = body;
    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Usuario no autorizado", { status: 401 });

    if (isGroup && (!members || members.length < 2 || !name))
      return new NextResponse("Datos inválidos", { status: 400 });

    if (isGroup) {
      const newChat = await prisma.chat.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        //Esto hace que prisma nos returne más que los ID's de los usuarios del Grupo.
        include: {
          users: true,
        },
      });

      newChat.users.forEach((user) => {
        if (user.email) pusherServer.trigger(user.email, "chat:new", newChat);
      });
      return NextResponse.json(newChat);
    }

    //OR solo se puede usar en findMany
    const existingChat = await prisma.chat.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleChat = existingChat[0];

    if (singleChat) {
      return NextResponse.json(singleChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newChat.users.map((user) => {
      if (user.email) pusherServer.trigger(user.email, "chat:new", newChat);
    });

    return NextResponse.json(newChat);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
