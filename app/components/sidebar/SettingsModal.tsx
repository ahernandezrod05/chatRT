"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { CldUploadButton } from "next-cloudinary";

import Input from "../Input/Input";
import Modal from "../Modals/Modal";
import Button from "../Button";
import Image from "next/image";
import { toast } from "react-hot-toast";
//Componente que abre el perfil del usuario para poder cambiar el nombre o el avatar.
interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser = {},
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  //Aquí sube el nuevo avatar a Cloudinary
  const handleUpload = (result: any) => {
    setValue("image", result.info.secure_url, {
      shouldValidate: true,
    });
  };

  //Cuando envía el formulario, hace una llamada al endpoint de settings
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          toast.error("Ha habido algún error, inténtelo más tarde");
        }
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
            >
              Perfil
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Cambiar información pública
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label
                  htmlFor="photo"
                  className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-gray-900
                  "
                >
                  Avatar
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={
                      image ||
                      currentUser?.image ||
                      "/images/placeholder_user_avatar.svg"
                    }
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="t8v9yuhq"
                  >
                    <Button disabled={isLoading} secondary type="button">
                      Cambiar
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          "
        >
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isLoading} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
