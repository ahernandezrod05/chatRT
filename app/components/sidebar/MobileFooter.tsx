"use client";

import useChat from "@/app/hooks/useChat";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
function MobileFooter() {
  const items = useRoutes();
  const { isOpen } = useChat();

  if (isOpen) {
    return null;
  }

  return (
    <div
      className="
  fixed
  justify-between
  w-full
  bottom-0
  z-40
  flex
  items-center
  bg-white
  borter-t-[1px]
  lg:hidden
  "
    >
      {items.map((item) => (
        <MobileItem
          key={item.label}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={item.active}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}

export default MobileFooter;
