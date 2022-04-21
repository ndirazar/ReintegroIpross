import React, { useEffect, useState } from 'react';
//TODO esta es una solucion para que la tabla renderice los iconos de material https://github.com/mbrn/material-table no es muy elgente, deberiamos revisarla
import AddBox from '@material-ui/icons/AddBox';
import { forwardRef } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Grid, IconButton, makeStyles } from '@material-ui/core';
import { TABLE } from '../../labels';
import ActionBar from './ActionBar';
import { Sort } from '@material-ui/icons';

type Props = {
  data: any;
  title: string;
  columns: any;
  options?: any;
  actions?: any;
  detailPanel?: any;
  onRowClick?: any;
  onFilterClick?: () => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onChangeRowsPerPage?: (pageSize: number) => void;
  totalCount?: number;
  pagination?: any;
  editable?: any;
  onSelectionChange?: (rows: any) => void;
  pageSize?: number;
  paging?: boolean;
  headerActions?: any;
  tableFiltersConfig?: any;
  tableFilters?: any;
  handleFilters?: (filters: any) => void;
  clearFilters?: () => void;
};

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    '& *::-webkit-scrollbar': {
      '-webkit-appearance': 'initial !important',
    },
    '& *::-webkit-scrollbar:horizontal': {
      height: '1em !important',
      border: '1px solid #f0f0f0',
    },
    '& *::-webkit-scrollbar-track': {
      background: '#f6f6f6',
    },
    '& *::-webkit-scrollbar-thumb': {
      backgroundColor: '#8196aa',
      backgroundClip: 'padding-box',
      border: 'none',
      borderRadius: 0,
    },
    '& *::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#5b6e81',
    },
    '& *::-webkit-scrollbar-button:single-button': {
      display: 'block',
      width: '16px',
      height: '16px',
      backgroundSize: '9px',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#f0f0f0',
    },
    '& *::-webkit-scrollbar-button:single-button:hover': {
      backgroundColor: `#e3e3e3`,
    },
    '& *::-webkit-scrollbar-button:single-button:horizontal:decrement': {
      backgroundPosition: '5px 3px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(96, 96, 96)'><polygon points='0,50 50,100 50,0'/></svg>")`,
    },
    '& *::-webkit-scrollbar-button:single-button:horizontal:increment': {
      backgroundPosition: '6px 3px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(96, 96, 96)'><polygon points='0,0 0,100 50,50'/></svg>");`,
    },
  },
  tableHeaderActions: {
    margin: 0,
    '&>.MuiBox-root': {
      margin: 0,
    },
    '&>button': {
      backgroundColor: '#616161',
      color: '#E0E0E0',
      textTransform: 'initial',
    },
  },
  toolbarContainer: {
    width: 'calc(100% - 64px)',
  },
  filterContainer: {
    position: 'relative',
    width: '64px',
  },
}));

const Table = (props: Props) => {
  const [windowLoaded, setWindowLoaded] = useState(false);
  const classes = useStyles();
  const tableIcons: any = {
    Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref: any) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref: any) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref: any) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref: any) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref: any) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: any) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: any) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: any) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: any) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: any) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: any) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: any) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: any) => <ViewColumn {...props} ref={ref} />),
  };
  const op = {
    ...props.options,
    pageSize: props.pageSize ?? 20,
    pageSizeOptions: [10, 20, 50],
    paging: props.paging ?? true,
    emptyRowsWhenPaging: false,
    showTextRowsSelected: false,
    grouping: false,
    rowStyle: (rowData) => ({
      whiteSpace: 'nowrap',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: rowData.active === false ? 'rgba(255,0,0,0.2)' : '#EEE',
    }),
    headerStyle: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      flexDirection: 'column',
    },
  };

  if (props.totalCount > 50) {
    op.pageSizeOptions.push(props.totalCount);
  }

  const handleFilterSubmit = (filters) => {
    props.handleFilters && props.handleFilters(filters);
  };

  const handleCancelFilter = () => {
    props.clearFilters && props.clearFilters();
  };

  useEffect(() => {
    setWindowLoaded(true);
  });

  return windowLoaded ? (
    <Grid className={classes.tableContainer}>
      <MaterialTable
        icons={tableIcons}
        columns={props.columns}
        data={props.data}
        totalCount={props.totalCount}
        page={props.pagination?.page}
        title={<>Listado de {props.title}</>}
        options={op}
        localization={{
          pagination: {
            labelRowsSelect: TABLE.labelRowsSelect,
            labelDisplayedRows: TABLE.labelDisplayedRows,
            labelRowsPerPage: TABLE.labelRowsPerPage,
            firstAriaLabel: TABLE.firstAriaLabel,
            firstTooltip: TABLE.firstTooltip,
            previousAriaLabel: TABLE.previousAriaLabel,
            previousTooltip: TABLE.previousTooltip,
            nextAriaLabel: TABLE.nextAriaLabel,
            nextTooltip: TABLE.nextTooltip,
            lastAriaLabel: TABLE.lastAriaLabel,
            lastTooltip: TABLE.lastTooltip,
          },
          header: {
            actions: TABLE.actions,
          },
          toolbar: {
            searchPlaceholder: TABLE.searchPlaceholder,
            exportCSVName: TABLE.exportCSV,
          },
          body: {
            emptyDataSourceMessage: TABLE.emptyDataSourceMessage,
          },
        }}
        actions={props.actions}
        detailPanel={props.detailPanel}
        onRowClick={props.onRowClick}
        onChangePage={props.onPageChange}
        onChangeRowsPerPage={props.onChangeRowsPerPage}
        editable={props.editable}
        onSelectionChange={(rows) => {
          props.onSelectionChange(rows);
        }}
        components={{
          Toolbar: (p) => (
            <Grid container>
              <Grid className={classes.toolbarContainer}>
                <MTableToolbar {...p} />
              </Grid>

              {props.onFilterClick && (
                <Grid className={classes.filterContainer}>
                  <IconButton onClick={props.onFilterClick} color="primary">
                    <Sort />
                  </IconButton>
                </Grid>
              )}
              <Grid style={{ padding: '0px 10px' }}>
                {props.headerActions && (
                  <ActionBar className={classes.tableHeaderActions} actions={props.headerActions} />
                )}
              </Grid>
            </Grid>
          ),
        }}
      />
    </Grid>
  ) : (
    <></>
  );
};

export default Table;
