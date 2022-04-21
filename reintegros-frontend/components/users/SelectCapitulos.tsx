import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { apiRequest } from '../common/types/Request';
import { useTheme, Theme } from '@material-ui/core/styles';

type Props = {
  capitulos: apiRequest;
  rowData: any;
  onSetUserCapitulos: (capitulosSelected: string[], userId: number) => void;
};

function getStyles(cap: string, capsSelected: string[], theme: Theme) {
  return {
    fontWeight:
      capsSelected.indexOf(cap) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
}

export default function SelectCapitulos({ capitulos, rowData, onSetUserCapitulos }: Props) {
  const theme = useTheme();
  const [capitulosSelected, setCapitulosSelected] = React.useState<string[]>(
    rowData.capitulos.map((cap) => cap.capitulo),
  );

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCapitulosSelected(event.target.value as string[]);
  };

  const handleClose = () => {
    onSetUserCapitulos(capitulosSelected, rowData.id);
  };

  return (
    <FormControl>
      <Select
        labelId="select-capitulos"
        id={`select-capitulos-${rowData.id}`}
        multiple={true}
        value={capitulosSelected}
        onChange={handleChange}
        input={<Input />}
        onClose={() => handleClose()}
        style={{ width: 180 }}
      >
        {capitulos !== undefined &&
          capitulos.results.map((cap) => (
            <MenuItem
              key={cap.capitulo}
              value={cap.capitulo}
              style={getStyles(cap.capitulo, capitulosSelected, theme)}
            >
              {cap.capitulo}. {cap.descripcion}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
