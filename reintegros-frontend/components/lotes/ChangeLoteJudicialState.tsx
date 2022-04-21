import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

type Props = {
  rowData: any;
  onSetState: (stateSelected: string, lote: any) => void;
};

export default function ChangeLoteJudicialState({ onSetState, rowData }: Props) {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onSetState(event.target.value as string, rowData);
  };

  return (
    <FormControl>
      <Select value={rowData.estado} multiple={false} onChange={handleChange}>
        <MenuItem key={'pagoRechazado'} value={'noProcesado'}>
          No procesado
        </MenuItem>
        <MenuItem key={'procesadoOk'} value={'procesadoOk'}>
          Procesado
        </MenuItem>
      </Select>
    </FormControl>
  );
}
