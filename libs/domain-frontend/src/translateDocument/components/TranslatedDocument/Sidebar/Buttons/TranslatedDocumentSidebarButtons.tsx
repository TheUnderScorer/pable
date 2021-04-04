import { Button, ButtonGroup } from '@chakra-ui/react';
import { FaIcon } from '@skryba/shared-frontend';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useExportTranslatedDocument } from '../../../../hooks/useExportTranslatedDocument';

export const TranslatedDocumentSidebarButtons = () => {
  const handleExport = useExportTranslatedDocument();

  return (
    <ButtonGroup>
      <Button
        id="export_document"
        onClick={handleExport}
        leftIcon={<FaIcon icon={faFileExport} />}
        colorScheme="primaryScheme"
      >
        Export
      </Button>
    </ButtonGroup>
  );
};
