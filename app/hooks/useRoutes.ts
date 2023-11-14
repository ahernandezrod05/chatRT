import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";
//Hook custom que trae las rutas que voy a usar. useMemo sirve para meter en cache ciertas funciones o datos que se van a usar mucho

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  //cacheando las rutas para evitar excesivos re-renders de la página. Solo vuelven a renderizarse si cambian los nombres introducidos o el chatId

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chats",
        icon: HiChat,
        active: pathname === "/chats" || !!conversationId,
      },
      {
        label: "Usuario",
        href: "/usuario",
        icon: HiUsers,
        active: pathname === "/usuario",
      },
      {
        label: "Salir",
        href: "#",
        onClick: () => {
          signOut();
        },
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
