import { DialogProperties, useDialogStore } from '../stores/useDialogStore';
import React, { useCallback } from 'react';
import { FaIcon } from '../ui/library';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export interface UseConfirmationDialogProps
  extends Pick<DialogProperties, 'title' | 'content'> {
  onConfirm?: () => void | Promise<void>;
  confirmColorScheme?: string;
  confirmText?: string;
}

export const useConfirmationDialog = ({
  onConfirm,
  title = 'Confirm action',
  content,
  confirmColorScheme,
  confirmText = 'Confirm',
}: UseConfirmationDialogProps) => {
  const setDialog = useDialogStore((store) => store.setDialog);

  return useCallback(() => {
    setDialog({
      title,
      content,
      titleIcon: <FaIcon color="danger" mr={2} icon={faExclamationTriangle} />,
      footerButtons: ({ handleClose, setLoading }) => [
        {
          children: 'Cancel',
          onClick: handleClose,
        },
        {
          children: confirmText,
          onClick: async () => {
            setLoading(true);

            await onConfirm?.();

            setLoading(false);
            handleClose();
          },
          colorScheme: confirmColorScheme,
        },
      ],
    });
  }, [confirmColorScheme, confirmText, content, onConfirm, setDialog, title]);
};
