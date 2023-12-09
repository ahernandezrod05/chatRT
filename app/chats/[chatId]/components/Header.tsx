"use client";

import { useMemo, useState } from "react";

import { Chat, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import Link from "next/link";
import { FaCaretLeft } from "react-icons/fa";
import ProfileDrawer from "./ProfileDrawer";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  chat: Chat & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ chat }) => {
  const otherUser = useOtherUser(chat);

  const [openDrawer, setOpenDrawer] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (chat.isGroup) return `${chat.users.length} miembros`;
    return isActive ? "En línea" : "Desconectado";
  }, [chat, isActive]);

  return (
    <>
      <ProfileDrawer
        data={chat}
        isOpen={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
      />
      <div
        className="
  bg-white 
  w-full 
  flex 
  border-b-[1px] 
  sm:px-4 
  py-3 
  px-4 
  lg:px-6 
  justify-between 
  items-center 
  shadow-sm
"
      >
        <div className="flex gap-3 items-center">
          <Link
            href="/chats"
            className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
          >
            <FaCaretLeft size={30} />
          </Link>
          {chat.isGroup ? (
            <AvatarGroup users={chat.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{chat.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-600">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={30}
          onClick={() => setOpenDrawer(true)}
          className="text-sky-800 cursor-pointer hover:text-sky-600 transition"
        />
      </div>
    </>
  );
};

export default Header;
