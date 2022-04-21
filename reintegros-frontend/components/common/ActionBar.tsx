import { Box, Button } from '@material-ui/core';
import React from 'react';
import { Action } from './types/Action';

type Props = {
  actions: Action[];
  className?: string;
};

export default function ActionBar({ actions, className }: Props) {
  return (
    <div className={className}>
      <Box m={4}>
        {actions.map((ac, index) => (
          <Button
            variant="contained"
            color="primary"
            key={index}
            onClick={ac.onClick}
            startIcon={ac.icon}
          >
            {ac.label}
          </Button>
        ))}
      </Box>
    </div>
  );
}
