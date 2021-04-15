import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

export const errorToastId = 'errorToast';

export const useToastOnError = () => {
  const toast = useToast();

  return useCallback(
    (error?: Error) => {
      if (!error) {
        return;
      }

      toast({
        id: errorToastId,
        duration: 9000,
        description: error.message,
        title: error.name,
        isClosable: true,
        status: 'error',
        position: 'top',
      });
    },
    [toast]
  );
};
