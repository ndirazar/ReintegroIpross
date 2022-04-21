import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { apiRequest } from '../common/types/Request';

type Props = {
  delegaciones: apiRequest;
  rowData: any;
  onSetDelegaciones: (delegacionesSelected: string[], userId: number) => void;
};

export default function SelectDelegacion({ delegaciones, rowData, onSetDelegaciones }: Props) {
  const [delegacionesSelected, setDelegacionesSelected] = React.useState<string[]>(
    rowData.delegaciones.map((delegacion) => delegacion.id),
  );

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDelegacionesSelected(event.target.value as string[]);
  };

  const handleClose = () => {
    onSetDelegaciones(delegacionesSelected, rowData.id);
  };

  return (
    <FormControl>
      <Select
        labelId="select-delegaciones"
        id={`select-delegaciones-${rowData.id}`}
        multiple={true}
        value={delegacionesSelected}
        onChange={handleChange}
        input={<Input />}
        onClose={() => handleClose()}
        style={{ width: 180 }}
      >
        {delegaciones !== undefined &&
          delegaciones.results.map((delegacion) => (
            <MenuItem key={delegacion.nombre} value={delegacion.id}>
              {delegacion.nombre}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
