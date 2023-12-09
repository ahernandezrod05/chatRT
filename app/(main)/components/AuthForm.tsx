"use client";
import Input from "@/app/components/Inputs/Input";
//En NextJS 13 hay que especificar en los componentes si van a ser usados en el servidor o en el cliente
//Ya que esto va a ser un formulario en el que vamos a usar varios Hooks de React como useEffect, hay que especificar que está en el cliente

import { useState, useCallback, useEffect } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

//Importando iconos de rect-icons
import { BsGithub } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";

import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";

import { signIn, useSession } from "next-auth/react";
//Los estados que va a tener el formulario. LOGIN o REGISTRO
type Action = "LOGIN" | "REGISTRO";
function AuthForm() {
  //Hook de la session
  const session = useSession();
  //Router de NextJS
  const router = useRouter();
  //Se le asigna los types de Action a este estado para que solo pueda tomar esos valores.
  const [action, setAction] = useState<Action>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  //Hook que devuelve una función desde la caché. Se almacena cada vez que el valor de array de dependencia cambia, en este caso action
  const toggleAction = useCallback(() => {
    if (action === "LOGIN") {
      setAction("REGISTRO");
    } else {
      setAction("LOGIN");
    }
  }, [action]);

  //useEffect para que si detecta una session redirija a página de usuario
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/usuario");
    }
  }, [session?.status, router]);

  //Variables pertinentes al formulario con el hook useForm. se extraen las funciones "register", "handleSubmit", y los errores de "formState". Se asignan los valores por defecto del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  //onSubmit es una función de tipo SubmitHandler y los datos que pasa son de tipo FieldValues, es decir, el valor de los campos del formulario
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (action === "REGISTRO") {
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status !== 200) toast.error("Ha habido un error");
          else signIn("credentials", data);
        })
        .finally(() => setIsLoading(false));
    }
    if (action === "LOGIN") {
      //Aquí es donde va a ir el login con credenciales de usuario, por lo cual el parametro que le tiene que llegar al endpoint AQUI es credentials
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          //Aquí entra una vez se resuelva signIn y entra en el callback. Si hay algún error
          //saltará el toast de error. Si no saltará el de Usuario existente
          if (callback?.error) {
            toast.error("El usuario introducido no existe");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("¡¡Bienvenido!!");
            router.push("/usuario");
          }
        })
        .finally(() => {
          //pase lo que pase con la promesa de signIn, se vuelve a poner isLoading a false para que pueda volver a usar el formulario si hace falta
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Si el estado "action" es igual a REGISTRO renderiza este campo. */}
          {action === "REGISTRO" && (
            <Input
              id="name"
              label="Nombre"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Dirección de Correo"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Input
            id="password"
            label="Contraseña"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          {/* Metiendo el submit en este botón hacemos que pueda activar la función onSubmit del formulario de ReactForm */}
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {action === "LOGIN" ? "Iniciar Sesión" : "Registrarse"}
            </Button>
          </div>
        </form>
        {/* Separador */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                O utilice sus cuentas
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>
              {action === "LOGIN"
                ? "¿Nuevo en chatRT?"
                : "¿Ya tiene una cuenta?"}
            </div>
            <div onClick={toggleAction} className="underline cursor-pointer">
              {action === "LOGIN" ? "Crear una cuenta" : "Inicie sesión"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
