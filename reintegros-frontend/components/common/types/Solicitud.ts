import { Delegacion } from './Delegacion';
import { Prestacion } from './Prestacion';

export type Solicitud = {
  id: number;
  delegacion: Delegacion | number;
  afiliado: any;
  estadoActual: 'pagoTotal' | 'pagoParcial' | 'sinPagos';
  fechaAlta: Date;
  prestaciones: Prestacion[] | number[];
};
