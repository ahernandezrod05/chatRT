import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
//Acción que pilla todos los usuarios que no son el usuario actual.
const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) return [];

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: { NOT: { email: session.user.email } },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
