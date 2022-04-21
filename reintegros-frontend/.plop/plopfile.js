var helpers = require('handlebars-helpers');
var handleCrud = require('./actions/createCrud');

module.exports = (plop) => {
  plop.setHelper('upperCase', function (text) {
    return text.toUpperCase();
  });
  plop.setHelper('pascalcase', helpers.string().pascalcase);
  plop.setHelper('camelcase', helpers.string().camelcase);
  plop.setGenerator('crud', {
    description: 'Generate structure for basic crud',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Api endpoint without slashes. Ex. nomenclador',
      },
    ], // array of inquirer prompts
    actions: handleCrud,
    // array of actions
  });
};
