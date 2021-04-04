import { ReactNode } from 'react';

export interface OnboardStep {
  title?: ReactNode;
  content: ReactNode;
  id: string;
}
