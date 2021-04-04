import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FaIcon } from '@skryba/shared-frontend';
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { isLast } from '@skryba/shared';
import { onboardSteps } from './steps';

export interface TranslateDocumentOnboardProps {
  onFinish?: () => void;
  finished?: boolean;
}

export const TranslateDocumentOnboard = ({
  onFinish,
  finished,
}: TranslateDocumentOnboardProps) => {
  const [open, setOpen] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = onboardSteps[currentStepIndex];

  const isLastStep = isLast(currentStepIndex, onboardSteps);

  const handleClose = useCallback(() => {
    onFinish?.();

    setOpen(false);

    setCurrentStepIndex(0);
  }, [onFinish]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      return handleClose();
    }

    setCurrentStepIndex((prev) => prev + 1);
  }, [handleClose, isLastStep]);

  useEffect(() => {
    if (!finished) {
      setOpen(true);
    }
  }, [finished]);

  if (finished) {
    return null;
  }

  return (
    <Modal
      scrollBehavior="inside"
      size="3xl"
      motionPreset="scale"
      isCentered
      closeOnOverlayClick={false}
      isOpen={open}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={3}>{currentStep.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{currentStep.content}</ModalBody>
        <ModalFooter>
          {currentStepIndex > 0 && (
            <Button
              mr={4}
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              leftIcon={<FaIcon icon={faArrowLeft} />}
            >
              Back
            </Button>
          )}
          <Button
            colorScheme={isLastStep ? 'successScheme' : 'primaryScheme'}
            onClick={handleNext}
            rightIcon={<FaIcon icon={isLastStep ? faCheck : faArrowRight} />}
          >
            {isLastStep ? 'Got it' : 'Next'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
