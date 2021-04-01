import React from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FaIcon, useConfirmationDialog } from '@skryba/shared-frontend';
import {
  faEllipsisV,
  faTrash,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslateDocumentStore } from '../../../stores/useTranslateDocumentStore';

export const TranslatedDocumentMenu = () => {
  const restoreTranslations = useTranslateDocumentStore(
    (store) => store.restoreAllTranslations
  );

  const clear = useTranslateDocumentStore((store) => store.clear);
  const handleClear = useConfirmationDialog({
    title: 'Remove document',
    content: 'Are you sure you want to remove this document?',
    onConfirm: clear,
    confirmColorScheme: 'dangerScheme',
    confirmText: 'Remove document',
  });

  return (
    <Menu>
      <MenuButton variant="link" as={IconButton}>
        <FaIcon icon={faEllipsisV} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={restoreTranslations}>
          <FaIcon icon={faUndo} mr={4} />
          Restore all translations
        </MenuItem>
        <MenuDivider />
        <MenuItem color="danger" onClick={handleClear}>
          <FaIcon icon={faTrash} mr={4} />
          Remove document
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
