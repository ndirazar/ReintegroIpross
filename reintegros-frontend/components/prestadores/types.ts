export type FormDataPrestador = {
  tipoDocumento?: string;
  nroDocumento: number;
  apellido: string;
  nombre: string;
  sexoSisa?: string;
  perEstado?: string;
  fechaNacimiento?: Date;
  lugarNacimiento?: string;
  nacionalidad?: string;
  domicilio?: string;
  localidadDes: string;
  profEstado: string;
  areaDes?: string;
  nroMatricula: number;
  libro: string;
  folio: number;
  matTipoRegistro?: string;
  matFechaRegistro?: Date;
  matCondicionMatricula?: string;
  matFechaExpededTitulo?: Date;
  tituloDes: string;
  especialidadDes?: string;
  institucionDes?: string;
};

export type FormImportPrestador = {
  file: File;
};

export type FiltersPrestador = {
  localidadDes?: string;
  profEstado?: string;
};
