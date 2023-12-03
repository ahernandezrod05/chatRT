"use client";
//Barra lateral del escritorio. se le pasa el usuario actual para pasarselo al componente del avatar.
//useRoutes es un hook custom que me devuelve las posibles rutas a las cuales se puede navegar con las barras de navegación.
//User es un tipo sacado del npx prisma generate con los atributos del modelo de User.
import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div
        className="
      hidden 
      lg:fixed 
      lg:inset-y-0 
      lg:left-0
      lg:z-40
      lg:w-20 
      xl:px-6 
      lg:overflow-y-auto 
      lg:bg-white 
      lg:border-r-[1px] 
      lg:pb-4 
      lg:flex 
      lg:flex-col 
      justify-between"
      >
        <nav className=" mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {/* Aquí se le pasa la ruta, el texto, el icono, si está activo y la función onClick si tienen como prop */}
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav
          className="
          mt-4
          flex
          flex-col
          justify-between
          items-center
        "
        >
          <div
            className="
            cursor-pointer
            hover:opacity-75
            transition
          "
            onClick={() => setIsOpen(true)}
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
