//Fichero de inicialización del cliente de Prisma. Prisma es un ORM que conectará con nuestra BD. Declara una variable global llamada Prisma de tipo PrismaClient.
//El cliente comprueba que no está definida la variable prisma, si lo está cliente == prisma, sino, lo asigna a un nuevo Cliente.
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
