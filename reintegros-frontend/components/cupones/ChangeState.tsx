import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

type Props = {
  rowData: any;
  onSetState: (stateSelected: string, cupon: any) => void;
};

export default function ChangeState({ onSetState, rowData }: Props) {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onSetState(event.target.value as string, rowData);
  };

  return (
    <FormControl>
      <Select value={['pagoRechazado']} multiple={true} onChange={handleChange}>
        <MenuItem key={'pagoRechazado'} value={'pagoRechazado'}>
          pagoRechazado
        </MenuItem>
        <MenuItem key={'abierto'} value={'abierto'}>
          abierto
        </MenuItem>
      </Select>
    </FormControl>
  );
}
