import { format, parseISO } from 'date-fns';
import { DELEGACIONES } from '../../labels';
import { CsvBuilder } from 'filefy';

const objToQueryString = (obj) => {
  var str = '';
  for (var key in obj) {
    if (obj === '' || obj === null || typeof obj[key] === 'undefined') {
      continue;
    }
    if (str !== '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(obj[key]);
  }
  return str;
};

const formatDate = (date) => {
  let d = date;
  if (typeof date === 'string') {
    if (date.search('Z') < 0) {
      d += 'T00:00:00.000Z';
    }
    d = parseISO(d);
  }
  return format(d, 'yyyy-MM-dd');
};

const formatDateNotification = (date) => {
  let dateISO = parseISO(date);
  return format(dateISO, 'dd MMM');
};

const strToDate = (str) => {
  if (!str || str === '') {
    return new Date();
  }
  const dateArr = str.split('-');
  const month = Number(dateArr[1]) - 1;
  return new Date(dateArr[0], month, dateArr[2]);
};

const getUserDelegaciones = () => {
  const user = getUser();
  if (!user?.delegaciones || user?.delegaciones.length < 1) {
    return [
      {
        value: '',
        label: DELEGACIONES.userWithoutDelegacionesOption,
      },
    ];
  }
  let del = user?.delegaciones?.map((d) => {
    return {
      value: d.id,
      label: d.nombre,
    };
  });
  if (isUserAdmin() || user?.casaCentral) {
    del = addAllToOpts(del, 'Todas');
  }
  return del;
};

const getUser = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
  }
  return false;
};

const isUserAdmin = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'Administrador')?.id;
};

const isUserCasaCentral = () => {
  const user = getUser();
  return !!user?.casaCentral;
};

const isUserReintegro = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'Reintegro')?.id;
};

const isUserDelegado = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'Delegado')?.id;
};

const isUserAuditoriaAdministrativa = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'AuditoriaAdministrativa')?.id;
};

const isUserAuditoriaCentral = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'AuditoriaCentral')?.id;
};

const isUserAuditoriaMedica = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'AuditoriaMedica')?.id;
};

const isUserContaduria = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'Contaduria')?.id;
};

const isUserTesoreria = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'Tesoreria')?.id;
};

const isUserPresidencia = () => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === 'Presidencia')?.id;
};

const checkUserRole = (role) => {
  const user = getUser();
  return user?.groups?.find((g) => g.name === role);
};

const userHasRole = (user, role) => {
  return user?.groups?.find((g) => g.name === role);
};

const addAllToOpts = (data: Array<{ label: string; value: any }>, allLabel: string = '') => {
  let d = [
    {
      label: allLabel || 'Todos',
      value: '',
    },
  ];
  return d.concat(data);
};

const getFileName = (relPath: any) => {
  if (!relPath) return '';
  if (typeof relPath.name === 'string') {
    return relPath.name;
  }
  const splitPath = relPath.split('/');

  return splitPath[splitPath.length - 1];
};

const exportTableData = (name, allColumns, allData) => {
  const columns = allColumns.filter((columnDef) => columnDef['export'] !== false);
  const exportedData = allData.map((rowData) =>
    columns.map((columnDef) => rowData[columnDef.field]),
  );
  return new CsvBuilder(name + '_' + formatDate(new Date()))
    .setDelimeter(',')
    .setColumns(columns.map((columnDef) => columnDef.title))
    .addRows(exportedData)
    .exportFile();
};

export {
  objToQueryString,
  formatDate,
  strToDate,
  getUserDelegaciones,
  getUser,
  isUserAdmin,
  isUserDelegado,
  isUserReintegro,
  isUserAuditoriaAdministrativa,
  isUserAuditoriaMedica,
  isUserAuditoriaCentral,
  isUserContaduria,
  isUserTesoreria,
  isUserPresidencia,
  addAllToOpts,
  checkUserRole,
  userHasRole,
  getFileName,
  formatDateNotification,
  isUserCasaCentral,
  exportTableData,
};
