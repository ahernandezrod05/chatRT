"use client";
import clsx from "clsx";

import useChat from "../hooks/useChat";
import NoChatSelected from "../components/NoChatSelected";
//Página principal cuando se abre un chat. Cuando se abre es que el usuario no tiene ningún chat seleccionado.
const Home = () => {
  //Sacamos aquí si algún chat está seleccionado. Si el chat está seleccionado esconde el mensaje de "Seleccione un chat.."
  //Y si no lo está, lo muestra.
  const { isOpen } = useChat();

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <NoChatSelected />
    </div>
  );
};

export default Home;
