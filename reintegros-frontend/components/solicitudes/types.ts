export type FormDataSolicitudes = {
  id: number;
  delgacion: number;
  factura: number;
};

export type FiltersSolicitudes = {
  afiliado: number;
  delgacion: number;
  estadoActual: string;
  fecha_alta_gt: string;
  fecha_alta_lt: string;
  judicial: number;
  source: string;
};
