import { OnboardStep } from './TranslateDocumentOnboard.types';
import { Heading, Image, Text, VStack } from '@chakra-ui/react';
import DocumentFlowImage from '../../../assets/flame-1235.png';
import Wizard from '../../../assets/wizard.gif';
import React from 'react';
import { TranslateDocumentOnboardTablePreview } from './TablePreview/TranslateDocumentOnboardTablePreview';
import { TranslateDocumentOnboardUploadPreview } from './UploadPreview/TranslateDocumentOnboardUploadPreview';
import { TranslateDocumentOnboardDocumentPreview } from './DocumentPreview/TranslateDocumentOnboardDocumentPreview';

export const onboardSteps: OnboardStep[] = [
  {
    id: 'onboard_start',
    content: (
      <VStack spacing={2}>
        <Image maxH="300px" src={DocumentFlowImage} />
        <Heading textAlign="center" mb={4}>
          Welcome to document translator!
        </Heading>
        <Text fontSize="xl">A new way to translate your documents.</Text>
      </VStack>
    ),
  },
  {
    id: 'step_1',
    title: 'Step 1',
    content: (
      <VStack spacing={8}>
        <Heading>Add words into table</Heading>
        <TranslateDocumentOnboardTablePreview />
        <Text>
          In order to translate document first add some words with translations
          into table.
        </Text>
      </VStack>
    ),
  },
  {
    id: 'step_2',
    title: 'Step 2',
    content: (
      <VStack spacing={8}>
        <Heading>Upload document</Heading>
        <TranslateDocumentOnboardUploadPreview />
      </VStack>
    ),
  },
  {
    id: 'step_3',
    title: 'Step 3',
    content: (
      <VStack spacing={4}>
        <Heading>Manage translations</Heading>
        <TranslateDocumentOnboardDocumentPreview />
        <Text>Exclude translations that you don't like!</Text>
      </VStack>
    ),
  },
  {
    id: 'step_4',
    title: 'Step 4',
    content: (
      <VStack spacing={4}>
        <Heading>All done!</Heading>
        <Image maxHeight="200px" src={Wizard} />
        <Text>
          Export your translated document and enjoy your free time that you've
          gained by using Skryba 2.0!
        </Text>
      </VStack>
    ),
  },
];
