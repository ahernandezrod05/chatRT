"use client";

import { useMemo, useState } from "react";

import { Chat, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import Link from "next/link";
import { FaCaretLeft } from "react-icons/fa";

interface HeaderProps {
  chat: Chat & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ chat }) => {
  const otherUser = useOtherUser(chat);

  return (
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
        <Avatar user={otherUser} />
        <div className="flex flex-col">
          <div>{otherUser.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
