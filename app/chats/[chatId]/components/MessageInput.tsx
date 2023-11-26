"use client";

import useChat from "@/app/hooks/useChat";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { RiMailSendLine } from "react-icons/ri";
import { HiPhotograph } from "react-icons/hi";
import Input from "./Input";
import { CldUploadButton } from "next-cloudinary";
//Componente que usa useForm de react para la gestión y validación del formulario. onSubmit hace una petición POST a mi endpoint y guarda el mensaje.

const MessageInput = () => {
  const { chatId } = useChat();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, chatId }),
    });
  };

  const handleUpload = (result: any) => {
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: result?.info?.secure_url, chatId }),
    });
  };
  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="t8v9yuhq"
      >
        <HiPhotograph size={30} className="text-sky-600" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <Input
          id="message"
          register={register}
          errors={errors}
          placeholder="Escriba aquí su mensaje..."
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-950 transition"
        >
          <RiMailSendLine size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
