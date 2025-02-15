// import { create } from 'zustand'

// interface useGlobalModalProps {

//     isOpen: boolean
//     onOpen: () => void
//     onClose: () => void
//     title: string
//     isDismissable: boolean
//     description: string
//     children: React.ReactNode

// }

// export const useGlobalModal = create<useGlobalModalProps>((set) => ({
//     isOpen: false,
//     isDismissable: true,
//     onOpen: () => set({ isOpen: true }),
//     onClose: () => set({ isOpen: false }),
//     title: "",
//     description: "",
//     children: <></>

// }))

// working code starts here add new factory

import { create } from "zustand";

interface useGlobalModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  isDismissable: boolean;
  description: string;
  children: React.ReactNode;
  setTitle: (title: string) => void; // A function to set the title dynamically
  setChildren: (children: React.ReactNode) => void; // A function to set children dynamically
}

export const useGlobalModal = create<useGlobalModalProps>((set) => ({
  isOpen: false,
  isDismissable: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => {
    set({ isOpen: false });
    window.location.reload();
  },
  title: "",
  description: "",
  children: <></>,

  // Function to set the title
  setTitle: (title) => set({ title }),

  // Function to set the children (content)
  setChildren: (children) => set({ children }),
}));
