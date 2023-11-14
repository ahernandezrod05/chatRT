"use client";
//Componente del Avatar. Aquí se le pasa el usuario como prop para que coja la imagen. Si el usuario no tiene un avatar se le pondrá uno por defecto.
import { User } from "@prisma/client";
import Image from "next/image";
interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  return (
    <div className="relative">
      <div
        className="
        relative 
        inline-block
        rounded-full 
        overflow-hidden 
        h-9 
        w-9 
        md:h-11
        md:w-11"
      >
        <Image
          alt="Imagen de por defecto del avatar del usuario"
          src={user?.image || "/images/placeholder_user_avatar.svg"}
          fill
        />
      </div>
      <span
        className="
        absolute
        block
        rounded-full
        overflow-hidden
        bg-green-500
        ring-2
        ring-white
        top-0
        right-0
        h-2
        w-2
        md:h-3
        md:w-3
      "
      />
    </div>
  );
};

export default Avatar;
