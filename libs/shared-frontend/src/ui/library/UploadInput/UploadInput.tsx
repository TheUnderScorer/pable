import { Button, ButtonProps } from '@chakra-ui/react';
import React, {
  forwardRef,
  MutableRefObject,
  useCallback,
  useRef,
} from 'react';

export interface UploadInputProps extends Omit<ButtonProps, 'onClick'> {
  onFile?: (files: File[]) => unknown;
  multiple?: boolean;
  clearAfterOnFile?: boolean;
  accept?: string;
}

export const UploadInput = forwardRef<HTMLButtonElement, UploadInputProps>(
  ({ children, onFile, multiple, clearAfterOnFile, accept, ...props }, ref) => {
    const uploadRef = useRef<HTMLInputElement>();

    const handleClick = useCallback(() => {
      uploadRef.current?.click();
    }, []);

    return (
      <>
        <input
          accept={accept}
          id={props.id ? `${props.id}_upload` : undefined}
          multiple={multiple}
          onChange={(event) => {
            onFile?.(Array.from(event.target.files ?? []));

            if (clearAfterOnFile) {
              uploadRef.current.value = '';
            }
          }}
          type="file"
          style={{
            display: 'none',
          }}
          ref={uploadRef as MutableRefObject<HTMLInputElement>}
        />
        <Button ref={ref} {...props} onClick={handleClick}>
          {children}
        </Button>
      </>
    );
  }
);
