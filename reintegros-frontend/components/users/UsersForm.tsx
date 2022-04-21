import { Box } from '@material-ui/core';
import React from 'react';
import Form from '../builder/Form';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FormDataUser } from './types';

export default function UsersForm() {
  const config: FormConfig<FormDataUser> = [
    {
      name: 'otro',
      type: FieldType.int,
      label: 'otro',
      styling: {
        columns: 4,
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'test',
      type: FieldType.string,
      label: 'test',
      styling: {
        columns: 4,
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'test2',
      type: FieldType.date,
      label: 'test2',
      styling: {
        columns: 4,
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'test3',
      type: FieldType.time,
      label: 'test3',
      styling: {
        columns: 4,
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'test4',
      type: FieldType.boolean,
      label: 'test4',
      styling: {
        columns: 4,
      },
    },
    {
      name: 'test5',
      type: FieldType.int,
      label: 'test5',
      styling: {
        columns: 4,
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'test6',
      type: FieldType.float,
      label: 'test6',
      styling: {
        columns: 4,
      },
      rules: {
        required: true,
      },
    },

    {
      name: 'test7',
      type: FieldType.options,
      label: 'test7',
      options: [
        { value: '1', label: 'uno' },
        { value: '2', label: 'dos' },
        { value: '3', label: 'tres' },
      ],
      styling: {
        columns: 4,
      },
    },
  ];
  return (
    <Box>
      <Form
        config={config}
        data={{ test: '', test5: 3, test2: '02/02/2020', otro: 123, test3: 12, test7: '' }}
        onSubmit={(data) => console.log(data)}
        onCancel={() => console.log('cancelado')}
      />
    </Box>
  );
}
