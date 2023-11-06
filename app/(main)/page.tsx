import Image from "next/image";
import AuthForm from "./components/AuthForm";
//Página principal de la web
export default function Home() {
  return (
    <div
      className="
    flex
    min-h-full
    flex-col
    justify-center
    py-12
    sm:px-16
    lg:px-8
    bg-gray-300"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo del sitio"
          height={100}
          width={100}
          className="mx-auto"
          src="/images/logo.svg"
        />
        <h2 className="mt-6 text-center text-3xl - font-bold tracking-tight text-blue-950">
          Entre con su cuenta
        </h2>
      </div>
      {/* Componente de la autentificación */}
      <AuthForm />
    </div>
  );
}
