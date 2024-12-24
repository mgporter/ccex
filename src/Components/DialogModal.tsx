import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface DialogModalProps extends React.PropsWithChildren {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function DialogModel({ isOpenState: [isOpen, setIsOpen], children }: DialogModalProps) {


  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[2000]">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4
        lg:p-0">
        <DialogPanel className="relative min-w-[500px] min-h-[300px] w-[80%]
        bg-stone-100 rounded-lg border border-gray-500
          lg:min-w-min lg:w-full lg:max-w-full lg:min-h-min">

          {children}

        </DialogPanel>
      </div>
    </Dialog>
  )
}