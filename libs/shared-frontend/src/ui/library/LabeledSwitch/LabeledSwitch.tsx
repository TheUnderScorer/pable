import React, { MouseEventHandler } from 'react';
import { Button, HStack, Switch, SwitchProps } from '@chakra-ui/react';

export interface LabeledSwitchProps extends SwitchProps {
  spacing?: number;
  leftLabel?: string;
  rightLabel?: string;
  onLeftClick?: MouseEventHandler;
  onRightClick?: MouseEventHandler;
}

export const LabeledSwitch = ({
  spacing = 4,
  leftLabel,
  rightLabel,
  onLeftClick,
  onRightClick,
  ...rest
}: LabeledSwitchProps) => {
  return (
    <HStack spacing={spacing}>
      {leftLabel && (
        <Button color="inherit" p={0} variant="link" onClick={onLeftClick}>
          {leftLabel}
        </Button>
      )}
      <Switch {...rest} />
      {rightLabel && (
        <Button color="inherit" p={0} variant="link" onClick={onRightClick}>
          {rightLabel}
        </Button>
      )}
    </HStack>
  );
};
