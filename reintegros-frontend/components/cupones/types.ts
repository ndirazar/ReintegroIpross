export type FormDataCupones = {
  //entity fields here
  ex: number;
};

export type FiltersCupones = {
  fecha_alta__gt?: string;
  fecha_alta__lt?: string;
  capitulo?: string;
  delegacion?: string;
  estado?: string;
  nroLote?: string;
  page?: number;
  size?: number;
};
