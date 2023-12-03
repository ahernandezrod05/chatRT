"use client";

import React, { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modals/Modal";
import Button from "@/app/components/Button";
import useChat from "@/app/hooks/useChat";
import { toast } from "react-hot-toast";
//Modal que aparece cuando el usuario va a borrar un chat pidiendo confirmación.
interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { chatId } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  //En esta función, se cachea cuando un usuario va a borrar un chat
  //Solo vuelve a renderizar la página si los props cambian.
  const onDelete = useCallback(() => {
    setIsLoading(true);

    fetch(`/api/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          onClose();
          router.push("/chats");
          router.refresh();
        } else {
          toast.error("Hubo algún problema, inténtelo más tarde");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, chatId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
        >
          <FiAlertTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div
          className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
        >
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              ¿Está seguro de que quiere eliminar este chat? Esta acción es
              permanente.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Borrar
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
