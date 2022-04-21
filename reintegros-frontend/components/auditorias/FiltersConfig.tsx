import { PRESTACIONES, AUDITORIAS } from '../../labels';
import { get } from '../api-call/service';
import { FormConfig } from '../builder/FormConfig';
import { FieldType } from '../builder/FormField';
import { FiltersAuditorias } from './types';

const filterConfig: FormConfig<FiltersAuditorias> = [
  {
    name: 'auditorActual',
    type: FieldType.options,
    label: PRESTACIONES.filters.auditorActual,
    options: async () => {
      return (await get('api/usuarios/?groups=1,5,6')).data.results.map((d) => ({
        value: d.id,
        label: d.first_name + ' ' + d.last_name,
      }));
    },
    styling: {
      columns: 12,
    },
  },
  {
    name: 'estadoActual',
    type: FieldType.options,
    label: PRESTACIONES.filters.estadoActual,
    options: PRESTACIONES.optionsEstadoActual,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'nomenclador',
    type: FieldType.options,
    label: PRESTACIONES.filters.nomenclador,
    options: async (form, query) => {
      return (await get(`api/nomenclador/?codigo=${query}&size=5`)).data.results.map((d) => ({
        value: d.codigo,
        label: d.codigo + ' - ' + d.descripcion,
      }));
    },
    styling: {
      columns: 12,
    },
  },
  {
    name: 'prestador',
    type: FieldType.options,
    label: PRESTACIONES.filters.prestador,
    options: async (form, query) => {
      return (await get(`api/prestadores/?nombre=${query}&size=5`)).data.results.map((d) => ({
        value: d.id,
        label: `${d.matricula} - ${d.nombre} ${d.apellido}`,
      }));
    },
    styling: {
      columns: 12,
    },
  },
  {
    name: 'fecha_alta__gt',
    type: FieldType.date,
    label: PRESTACIONES.filters.fechaDesde,
    styling: {
      columns: 12,
    },
  },
  {
    name: 'fecha_alta__lt',
    type: FieldType.date,
    label: PRESTACIONES.filters.fechaHasta,
    styling: {
      columns: 12,
    },
    rules: {
      required: false,
    },
  },
];

export default filterConfig;
