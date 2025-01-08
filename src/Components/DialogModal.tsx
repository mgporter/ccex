import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";

interface DialogModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  closeAction: () => void;
  container?: HTMLElement | null;
  className?: string;
}

export default function DialogModel({ isOpen, closeAction, children, className, container = document.body }: DialogModalProps) {

  // const dialogRef = useRef<HTMLDivElement>(null!);
  const { setModelIsVisible } = useCCEXStore();

  useEffect(() => {
    setModelIsVisible(isOpen);
  }, [isOpen, setModelIsVisible])

  function handleClose() {
    closeAction();
  }

  return (
    <>
      {isOpen && createPortal(
        <div className="absolute inset-0 w-full h-full z-[2000]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={handleClose} aria-hidden="true" />
          <div className="absolute inset-0 flex w-full h-full items-center justify-center p-4 pointer-events-none
            lg:p-0">
            <div className={"relative pointer-events-auto \
            bg-stone-100 rounded-lg border border-gray-500 " + className}>

              {children}

            </div>
          </div>
        </div>,
        container || document.body
      )}
    </>
  )
}
