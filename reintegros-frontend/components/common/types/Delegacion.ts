import { Prestacion } from './Prestacion';

export type Delegacion = {
  id: number;
  nombre: string;
  estadoActual: 'pagoTotal' | 'pagoParcial' | 'sinPagos';
  fechaAlta: Date;
  prestaciones: Prestacion[] | number[];
};
