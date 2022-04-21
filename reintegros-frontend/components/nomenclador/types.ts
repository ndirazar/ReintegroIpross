export type FormDataNomenclador = {
  areaCubrir?: number;
  capitulo?: number;
  catPresPracticaLugar?: number;
  codigo?: number;
  complejidadPractica?: number;
  descripcion?: string;
  fechaNorma?: Date;
  modalidadPresentacion?: string;
  montoFijoMensual?: number;
  numeroNormaRespaldatoria?: string;
  periodoTope?: string;
  programaSanitario?: string;
  topesCoberturaPeriodo?: number;
  unidadGalenoAyudante?: number;
  unidadGalenoEspecialista?: number;
  unidadGasto?: number;
  unidadMateriales?: number;
  valorAyudante?: number;
  valorEspecialista?: number;
  valorGasto?: number;
  valorIpross?: number;
  valorMontoFijo?: number;
  requiereAuditoriaMedica: boolean;
};

export type FiltersNomenclador = {
  capitulo: string;
  modalidadPrestacion: string;
};
