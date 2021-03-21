import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
} from '@chakra-ui/react';
import React, { PropsWithChildren, ReactNode } from 'react';

export interface DialogProps extends AlertDialogProps {
  title: ReactNode;
  footer?: ReactNode;
}

export const Dialog = ({
  title,
  footer,
  children,
  ...props
}: PropsWithChildren<DialogProps>) => {
  return (
    <AlertDialog {...props}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader display="flex" alignItems="center">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{children}</AlertDialogBody>
          <AlertDialogFooter>{footer}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
