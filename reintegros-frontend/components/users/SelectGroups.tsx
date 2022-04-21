import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { apiRequest } from '../common/types/Request';

type Props = {
  grupos: apiRequest;
  rowData: any;
  onSetUserGroups: (groupsSelected: string[], userId: number) => void;
};

export default function SelectGroups({ grupos, rowData, onSetUserGroups }: Props) {
  const [groupsSelected, setGroupsSelected] = React.useState<string[]>(
    rowData.groups.map((grupo) => grupo.name),
  );

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGroupsSelected(event.target.value as string[]);
  };

  const handleClose = () => {
    onSetUserGroups(groupsSelected, rowData.id);
  };

  return (
    <FormControl>
      <Select
        labelId="select-grupos"
        id={`select-grupos-${rowData.id}`}
        multiple={true}
        value={groupsSelected}
        onChange={handleChange}
        input={<Input />}
        onClose={() => handleClose()}
        style={{ width: 180 }}
      >
        {grupos !== undefined &&
          grupos.results.map((grupo) => (
            <MenuItem key={grupo.name} value={grupo.name}>
              {grupo.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
