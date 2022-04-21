// Third-party imports
import React, { useState, useCallback } from 'react';
import {
  FormControl,
  FormHelperText,
  TextField,
  CircularProgress,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Controller, FieldName, UseFormMethods } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { IconButton } from '@material-ui/core';

// App imports
import { FormField, OptionsField } from '.';
import { Help } from '@material-ui/icons';

// Props & other types
type Props<T> = {
  field: FormField<T>;
  error: string;
  rules: any;
  form: UseFormMethods<Partial<T>>;
};

const useStyles = makeStyles((theme) => ({
  selectInput: {
    position: 'relative',
    '& .MuiInputBase-root': {
      border: '1px solid #565656',
      borderRadius: '6px',
      paddingLeft: '10px',
      marginTop: '15px',
      '& .MuiInputBase-input': {
        border: 'none',
      },
    },
    '& >.MuiInput-underline:after': {
      border: 'none',
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '0',
    },
    '& .MuiInputLabel-formControl': {
      width: '100%',
    },
  },
  tipoHelp: {
    position: 'absolute',
    top: '0',
    right: '0',
    padding: '5px',
    '& .MuiSvgIcon-root': {
      width: '.6em',
      height: '.6em',
      fontSize: '1.2em',
    },
  },
}));
// Component
export default function FormBuilderAutocomplete<T>({ field, error, form }: Props<T>) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [options, setOptions] = useState<OptionsField>(
    Array.isArray(field.options) ? field.options : [],
  );
  const optionsFunction: (
    form: UseFormMethods<Partial<T>>,
    query: string,
  ) => Promise<OptionsField> = Array.isArray(field.options) ? null : field.options;
  const [inputText, setInputText] = useState(form.getValues()[field.name]?.label || '');
  const [currentValue, setCurrentValue] = useState(form.getValues()[field.name]);

  const updateOptions = useCallback(() => {
    if (optionsFunction) {
      setLoading(true);
      optionsFunction(form, query)
        .then((newOptions) => {
          setOptions(newOptions || []);
          // This fixes the bug in Autocomplete, that does not refresh the label
          // const currentValue = form.getValues()[field.name];

          if (currentValue) {
            if (field.multiple) {
              form.setValue(field.name as any, (field.multiple ? [] : null) as any);
            } else {
              form.setValue(field.name as any, currentValue);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [optionsFunction, form, query, field.multiple, field.name]);

  // If it has a value, an the option in not loaded, then load options
  let shouldLoad: boolean;
  // const currentValue = form.getValues()[field.name];
  if (field.multiple) {
    shouldLoad =
      optionsFunction &&
      currentValue &&
      currentValue.length &&
      !options.filter((o) => currentValue.indexOf(o.value) >= 0).length;
  } else {
    shouldLoad = optionsFunction && currentValue && !options.find((o) => o.value === currentValue);
  }

  const [mounted, setMounted] = useState(false);
  // Load option it is has data
  React.useEffect(() => {
    // let mounted = true;
    if (!mounted && shouldLoad) {
      updateOptions();
      setMounted(true);
      setCurrentValue(form.getValues()[field.name]);
    }
  }, [shouldLoad, updateOptions]);

  // Load option it is has data
  React.useEffect(() => {
    let fieldVal = '';

    if (typeof form.getValues()[field.name] === 'object') {
      fieldVal = form.getValues()[field.name]?.label;
    } else if (typeof form.getValues()[field.name] === 'string') {
      fieldVal = form.getValues()[field.name];
    } else {
      fieldVal = '';
    }

    // setCurrentValue(form.getValues()[field.name]);
    setInputText(fieldVal);
    // console.log({field: field.name, fieldVal, currentValue, inputText})
  }, [field, form, setCurrentValue]);

  const getInputTextValue = (props) => {
    return props.value?.label || inputText || '';
  };

  const getFieldLabel = () => {
    return (
      <>
        <span>{field.label + (field.rules?.required === true ? ' *' : '')}</span>
        {!!field.tooltip && (
          <Tooltip
            title={<Typography>{field.tooltip}</Typography>}
            placement="top-start"
            arrow={true}
          >
            <IconButton aria-label="Help" className={classes.tipoHelp}>
              <Help />
            </IconButton>
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <FormControl component="fieldset" error={!!error} fullWidth>
      <Controller
        // label={getFieldLabel()}
        defaultValue={currentValue}
        render={(props) => (
          <Autocomplete
            freeSolo={true}
            open={open}
            onOpen={() => {
              setOpen(true);
              updateOptions();
            }}
            onClose={() => setOpen(false)}
            options={options}
            disabled={field.disabled}
            loading={loading}
            multiple={field.multiple}
            getOptionDisabled={() => loading}
            getOptionSelected={(option, value) =>
              option.value ===
              (!value ? '' : typeof value === 'string' ? (value as any) : value?.value)
            }
            onChange={(event, newValue) => {
              const aux = newValue === null ? '' : (newValue as any);
              form.setValue(
                field.name as any,
                typeof newValue === 'string' ? aux : (aux?.value as string),
              );
              setInputText(
                options.find(
                  (o) => o.value === (typeof newValue === 'string' ? aux : newValue?.value),
                )?.label || '',
              );
              setCurrentValue(newValue);
              // setInputText(aux.label ? aux?.label : aux);
              setQuery(aux.label ? aux?.label : aux);
              field.onChange && field.onChange(aux, form);
            }}
            getOptionLabel={(option) =>
              options.find(
                (o) => o.value === (typeof option === 'string' ? (option as string) : option.value),
              )?.label || ''
            }
            value={props.value}
            inputValue={getInputTextValue(props)}
            renderInput={(params) => (
              <TextField
                {...params}
                // value={props.value}
                error={!!error}
                label={getFieldLabel()}
                className={classes.selectInput}
                fullWidth
                placeholder={field.placeholder}
                onChange={(event) => {
                  setInputText(event.target.value);
                  if (field.onUpdate) {
                    field.onUpdate(event.target.value, form);
                  }
                  setQuery(event.target.value);
                  updateOptions();
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                helperText={field.help || ''}
              />
            )}
          />
        )}
        id={field.name}
        name={field.name}
        rules={field.rules}
        noOptionsText={field.noOptionsText ? field.noOptionsText : 'No hay opciones'}
        control={form.control}
        onChange={(args) => {
          const value = !args[1]
            ? null
            : field.multiple
            ? args[1].map((v) => v.value || v)
            : args[1].value;
          field.onChange?.(value, form);
          return value;
        }}
      />
      {error && <FormHelperText className={'Mui-error'}>{error}</FormHelperText>}
    </FormControl>
  );
}
