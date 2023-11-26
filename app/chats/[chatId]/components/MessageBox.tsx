"use client";

import Avatar from "@/app/components/Avatar";
import { MessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface MessageBoxProps {
  data: MessageType;
  isLast?: boolean;
}
//Componente que contiene los mensajes del chat. Se distingue entre los mensajes del usuario
//logueado y el resto.
//seenList es un array que devuelve datos como "Juan, Antonio, Roberto" para ver quien ha visto el mensaje
export const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const isMine = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  return (
    <div className={clsx("flex gap-2 p-4", isMine && "justify-end")}>
      <div className={clsx(isMine && "order-2")}>
        <Avatar user={data.sender} />
      </div>
      <div className={clsx("flex flex-col gap-2", isMine && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {/* {format(new Date(data.createdAt), "p")} */}
          </div>
        </div>
        {/* Mensaje */}
        <div
          className={clsx(
            "text-sm w-fit overflow-hidden p-2",
            isMine ? "bg-sky-500 text-white" : "bg-gray-100",
            data.image ? "rounded-md p-0" : "rounded-full"
          )}
        >
          {data?.image ? (
            <Image
              alt={`Imagen enviada por ${data?.sender?.email}`}
              height={300}
              width={300}
              src={data.image}
              className=" object-cover cursor-pointer hover:scale-110 transition"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isMine && seenList.length > 0 && (
          <div
            className="
          text-xs 
          font-light 
          text-gray-500
          "
          >
            {`Visto por ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};
