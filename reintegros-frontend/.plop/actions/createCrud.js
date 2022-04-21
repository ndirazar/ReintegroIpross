module.exports = (data) => {
  return [
    {
      type: 'add',
      path: '../components/{{camelcase name}}/FormConfig.tsx',
      templateFile: 'formConfig.hbs',
    },
    {
      type: 'add',
      path: '../components/{{camelcase name}}/{{pascalcase name}}.tsx',
      templateFile: 'main.hbs',
    },
    {
      type: 'add',
      path: '../components/{{camelcase name}}/{{pascalcase name}}Form.tsx',
      templateFile: 'form.hbs',
    },
    {
      type: 'add',
      path: '../components/{{camelcase name}}/{{pascalcase name}}List.tsx',
      templateFile: 'list.hbs',
    },
    {
      type: 'add',
      path: '../components/{{camelcase name}}/types.ts',
      templateFile: 'types.hbs',
    },
    {
      type: 'add',
      path: '../pages/{{camelcase name}}.tsx',
      templateFile: 'page.hbs',
    },

    {
      type: 'append',
      path: '../labels.ts',
      pattern: /#entitiesobject/,
      separator: '',
      template: `\n const {{upperCase name}} = {
        name: '{{pascalCase name}}',
        page: '{{camelCase name}}',
        route: 'api/{{camelCase name}}',
        fields:{
          ex: 'example'
        },
        renders: {
          is_active: (rowData) => (rowData ? 'Si' : 'No'),
        },
      };`,
    },

    {
      type: 'append',
      path: '../labels.ts',
      pattern: /#addtomenu/,
      separator: '',
      template: `\n{{upperCase name}},`,
    },
    {
      type: 'append',
      path: '../labels.ts',
      pattern: /#exportconsts/,
      separator: '',
      template: `\n{{upperCase name}},`,
    },
  ];
};
