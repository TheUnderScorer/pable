import React, { useMemo, useRef, useState } from 'react';
import { DialogProperties, useDialogStore } from '../../stores/useDialogStore';
import { pick } from 'remeda';
import { Dialog } from '../../ui/library';
import { Button, ButtonGroup } from '@chakra-ui/react';

export const DialogController = () => {
  const [loading, setLoading] = useState(false);

  const {
    content,
    footerButtons,
    open,
    title,
    titleIcon,
  } = useDialogStore((store) =>
    pick(store, ['title', 'titleIcon', 'content', 'footerButtons', 'open'])
  ) as DialogProperties;
  const hideDialog = useDialogStore((store) => store.hideDialog);

  const leastDestructiveRef = useRef<HTMLButtonElement>();

  const buttons = useMemo(() => {
    return footerButtons?.({ handleClose: hideDialog, setLoading }).map(
      (button, index) => (
        <Button
          isLoading={loading}
          key={index}
          {...button}
          ref={button.leastDestructive ? leastDestructiveRef : undefined}
        >
          {button.children}
        </Button>
      )
    );
  }, [footerButtons, hideDialog, loading]);

  return (
    <Dialog
      title={
        <>
          {titleIcon}
          {title}
        </>
      }
      leastDestructiveRef={leastDestructiveRef}
      isOpen={open}
      onClose={hideDialog}
      footer={<ButtonGroup>{buttons}</ButtonGroup>}
    >
      {content}
    </Dialog>
  );
};
