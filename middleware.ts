import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});
//Cuando la ruta coincida con esto, devuelve a la URL de Logout
export const config = {
  matcher: ["/usuario/:path*", "/chats/:path*"],
};
