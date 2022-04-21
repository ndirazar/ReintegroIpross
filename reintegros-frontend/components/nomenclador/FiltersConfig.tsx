import { NOMENCLADOR } from '../../labels';
import { get } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersNomenclador } from './types';

const filterConfig: FormConfig<FiltersNomenclador> = [
  {
    name: 'descripcion',
    type: FieldType.string,
    label: NOMENCLADOR.filters.descripcion,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'capitulo',
    type: FieldType.options,
    label: NOMENCLADOR.filters.capitulo,
    options: [],
    // options: async () => {
    //   return (await get('api/capitulos/')).data.results.map((c) => ({
    //     value: c.capitulo,
    //     label: c.capitulo + ' - ' + c.descripcion,
    //   }));
    // },
    styling: {
      columns: 12,
    },
    multiple: true,
  },
  {
    name: 'modalidadPrestacion',
    type: FieldType.options,
    label: NOMENCLADOR.filters.modalidad,
    options: async () => {
      return NOMENCLADOR.optionsModalidadPresentacion;
    },
    styling: {
      columns: 12,
    },
  },
  // {
  //   name: 'requiereAuditoriaMedica',
  //   type: FieldType.boolean,
  //   label: NOMENCLADOR.filters.requiereAuditoriaMedica,
  //   styling: {
  //     columns: 12,
  //   },
  // },
  {
    name: 'requiereAuditoriaMedica',
    type: FieldType.options,
    label: NOMENCLADOR.filters.requiereAuditoriaMedica,
    options: [
      {
        value: '',
        label: 'Todas',
      },
      {
        value: 'true',
        label: 'Si',
      },
      {
        value: 'false',
        label: 'No',
      },
    ],
    styling: {
      columns: 12,
    },
  },
];

export default filterConfig;
