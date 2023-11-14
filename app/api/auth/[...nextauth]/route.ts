import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";
//Endpoint necesario para nextAuth. en providers se le pasa los proveedores de
//Sesiones (en este caso, credenciales), adapter se le pasa si vamos a usar una BBDD para guardarlas (Prisma como conector en nuestro caso)
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    /*Aquí configuramos las credenciales necesarias. Label es el nombre del campo, type el tipo
    En authorize se configura la forma de autorizar al usuario. Básicamente si al enpoint llegan los datos sin email ni password se le manda un mensaje de error
    Si está todo en orden, busca el email en la BD, y si la pass no coincide con la contraseña hasheada, manda otro mensaje de error

    En isCorrect password usamos la librería bcrypt para comparar las contraseñas introducidas y guardadas
    
    */
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales Inválidas");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error(
            "El email introducido no existe o la contraseña no es válida"
          );
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error(
            "El email introducido no existe o la contraseña no es válida"
          );
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
