"use client";

import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/Avatar";
interface UserBoxProps {
  user: User;
}
//Componente de la caja donde están los datos del usuario.
const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  //función que abre un chat con el usuario seleccionado. La guarda en caché para que si abres otra vez
  //un chat con un usuario que le habías dado, lo coja de la caché
  const handleClick = useCallback(() => {
    setIsLoading(true);
    fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ha habido un error");
        }
        return res.json();
      })
      .then((data) => {
        router.push(`/chats/${data.id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setIsLoading(false));
  }, [user, router]);
  return (
    <div
      onClick={handleClick}
      className="
      w-full 
      relative 
      flex 
      items-center 
      space-x-3 
      bg-white 
      p-3 
      hover:bg-neutral-100
      rounded-lg
      transition
      cursor-pointer
    "
    >
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
