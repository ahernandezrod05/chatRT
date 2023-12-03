import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
//Endpoint que permite cambiar el perfil del usuario. Tanto nombre como avatar
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { name, image } = body;
    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Usuario no autorizado", { status: 401 });

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { image: image, name: name },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.log("Error cambiando el perfil", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
}
