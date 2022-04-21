import { ReactNode } from 'react';

export type Action = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
};
