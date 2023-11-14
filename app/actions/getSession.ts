import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
//Server Action que devuelve la sesión actual. Se ha puesto en una acción para no tener que llamar todo el rato a este hook
//se le pasa authOptions exportadas en nuestro endpoint para que coja la sesión con las credenciales disponibles

export default async function getSession() {
  return await getServerSession(authOptions);
}
