import { Solicitud } from './Solicitud';

export type Prestacion = {
  id: number;
  cantidad: number;
  coseguroNomenclador: number;
  valorIprossNomenclador: number;
  valorPrestacion: number;
  cobertura: number;
  periodo: 'dia' | 'mes' | 'trimestre' | 'anio';
  fechaPractica: Date;
  solicitud: number | Solicitud;
  capitulo: number | any;
  prestador: number | any;
  nomenclador: number | any;
  factura: number | any;
};
