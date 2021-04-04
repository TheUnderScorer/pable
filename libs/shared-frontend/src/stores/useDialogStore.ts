import { ReactNode } from 'react';
import { ButtonProps } from '@chakra-ui/react';
import create from 'zustand';

export interface DialogButtonProps extends ButtonProps {
  leastDestructive?: boolean;
}

export interface DialogButtonBag {
  setLoading: (loading: boolean) => void;
  handleClose: () => void;
}

export interface DialogProperties {
  title?: ReactNode;
  titleIcon?: ReactNode;
  content?: ReactNode;
  footerButtons?: (bag: DialogButtonBag) => DialogButtonProps[];
  open?: boolean;
}

export interface DialogStore extends DialogProperties {
  setDialog: (properties: DialogProperties) => void;
  hideDialog: () => void;
  open: boolean;

  [key: string]: unknown;
}

export const useDialogStore = create<DialogStore>((set) => ({
  title: undefined,
  titleIcon: undefined,
  content: undefined,
  footerButtons: undefined,
  open: false,
  setDialog: (properties) => {
    set({
      ...properties,
      open: true,
    });
  },
  hideDialog: () => {
    set({
      open: false,
    });
  },
}));
