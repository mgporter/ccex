import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DialogModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  closeAction: () => void;
  parent?: HTMLElement;
}

export default function DialogModel({ isOpen, closeAction, children, parent = document.body }: DialogModalProps) {

  function handleClose() {
    closeAction();
  }

  return (
    <>
      {isOpen && createPortal(
        <div className="absolute inset-0 z-[2000]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={handleClose} aria-hidden="true" />
          <div className="absolute inset-0 flex w-full items-center justify-center p-4 pointer-events-none
            lg:p-0">
            <div className="relative min-w-[500px] min-h-[300px] w-[80%] pointer-events-auto
            bg-stone-100 rounded-lg border border-gray-500
              lg:min-w-min lg:w-full lg:max-w-full lg:min-h-min">

              {children}

            </div>
          </div>
        </div>,
        parent || document.body
      )}
    </>
  )
}
