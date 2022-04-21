import {
  TextField,
  Checkbox,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  FormHelperText,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInputProps,
  InputAdornment,
  Box,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FieldType, FormField } from './FormField';
import DateFnsUtils from '@date-io/date-fns';
import { format, parseISO, subDays } from 'date-fns';
import { FORM_BUILDER } from '../../labels';
import FieldAutocomplete from './FieldAutocomplete';
import FileInput from '../common/FileInput';

// Needed for prevent passing 'value' and 'onChange' props
const DatePicker: any = KeyboardDatePicker;
const TimePicker: any = KeyboardTimePicker;
type Props = {
  field: any;
  form: any;
  data: any;
};

export const getError = (field: any, errors: any) => {
  if (errors && errors[field.name]) {
    switch (errors[field.name].type) {
      case 'required':
        return FORM_BUILDER.required;
      case 'min':
        return `${FORM_BUILDER.min} ${field.rules?.min}`;
      case 'minLength':
        return `${FORM_BUILDER.minLength} ${field.rules?.minLength}`;
      case 'max':
        return `${FORM_BUILDER.max} ${field.rules?.max}`;
      case 'maxLength':
        return `${FORM_BUILDER.maxLength} ${field.rules?.maxLength}`;
      case 'pattern':
        return errors[field.name].message || FORM_BUILDER.pattern;
      case 'validate':
        return errors[field.name].message;
      case 'unique':
        return `${FORM_BUILDER.unique}`;
      default:
        return errors[field.name].message || FORM_BUILDER.default;
      // return FORM_BUILDER.default;
    }
  } else {
    return null;
  }
};

export const getRules = (field, form) => {
  const rules = field.rules || {};
  if (rules.validate) {
    const oldMethod = rules.validate;
    rules.validate = () => oldMethod(form);
  }
  return rules;
};
export default function FieldRender({ field, form, data }: Props) {
  const { control, errors } = form;
  const variant = 'standard';

  const error = getError(field, errors);
  const rules = getRules(field, form);
  if (field.component === 'email') {
    rules.pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  }
  // Prefix & Suffix
  const inputProps: Partial<OutlinedInputProps> = {};
  if (field.prefix) {
    inputProps.startAdornment = <InputAdornment position="start">{field.prefix}</InputAdornment>;
  }
  if (field.suffix) {
    inputProps.endAdornment = <InputAdornment position="end">{field.suffix}</InputAdornment>;
  }

  const getMaxDate = (f) => {
    return f?.rules?.max || new Date(2100, 10, 1);
  };

  const getMinDate = (f) => {
    return f?.rules?.min || new Date(1900, 10, 1);
  };

  switch (field.type) {
    case FieldType.date:
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <Controller
            variant={variant}
            name={field.name}
            label={field.label + (field.rules?.required === true ? ' *' : '')}
            control={control}
            error={!!error}
            rules={rules}
            initialFocusedDate={null}
            defaultValue={
              (data[field.name] && format(parseISO(data[field.name]), 'MM/dd/yyyy')) ?? ''
            }
            render={(props) => (
              <DatePicker
                value={props.value || null}
                onChange={(e) => {
                  props.onChange(e);
                  field.onChange && field.onChange(e, form);
                }}
                inputRef={props.ref}
                maxDate={getMaxDate(field)}
                minDate={getMinDate(field)}
                // maxDate={field?.rules?.max || new Date(2100, 10, 1)}
                // minDate={field?.rules?.max || new Date(1900, 10, 1)}

                autoOk
                disableToolbar
                variant={variant}
                format="dd/MM/yyyy"
                inputVariant={variant}
                fullWidth={true}
                label={field.label}
                helperText={error}
                error={error}
                disabled={field.disabled}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                InputLabelProps={{
                  shrink: props.value ? true : undefined,
                }}
              />
            )}
          />
        </MuiPickersUtilsProvider>
      );
      break;

    case FieldType.time:
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <Controller
            variant={variant}
            error={!!error}
            rules={rules}
            render={(props) => (
              <TimePicker
                value={props.value}
                onChange={props.onChange}
                inputRef={props.ref}
                autoOk
                variant="inline"
                disableToolbar
                inputVariant={variant}
                fullWidth={true}
                label={field.label + (field.rules?.required === true ? ' *' : '')}
                error={!!error}
                helperText={error}
                disabled={field.disabled}
                format="HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            )}
            name={field.name}
            placeholder={field.placeholder}
            control={control}
          />
        </MuiPickersUtilsProvider>
      );
      break;
    case FieldType.int:
      return (
        <Controller
          render={(props) => (
            <TextField
              label={field.label + (field.rules?.required === true ? ' *' : '')}
              value={props.value}
              name={field.name}
              variant={variant}
              fullWidth={true}
              type="number"
              helperText={error}
              error={!!error}
              inputRef={props.ref}
              onChange={(event) => {
                form.setValue(field.name, parseFloat(event.target.value));
                field.onChange && field.onChange(parseFloat(event.target.value), form);
              }}
              onBlur={(event) => {
                field.onBlur && field.onBlur(event.target.value, form);
              }}
              InputProps={inputProps}
              disabled={field.disabled}
            />
          )}
          defaultValue={data[field.name]}
          type="number"
          name={field.name}
          label={field.label}
          control={control}
          error={!!error}
          rules={rules}
        />
      );
    case FieldType.float:
      return (
        <Controller
          render={(props) => (
            <TextField
              label={field.label + (field.rules?.required === true ? ' *' : '')}
              value={props.value}
              name={field.name}
              type="number"
              variant={variant}
              error={!!error}
              fullWidth={true}
              helperText={error || field.help}
              inputRef={props.ref}
              onChange={({ target: { value } }) => {
                let newVal = 0;
                const regex = /^\d+(\.\d{0,2})?$/;
                if (regex.test(value)) {
                  newVal = Number(value);
                } else {
                  newVal = Number(props.value);
                }
                form.setValue(field.name, newVal);
                props.onChange && props.onChange(newVal);
              }}
              onFocus={({ target: { value } }) => {
                if (value === '0') {
                  form.setValue(field.name, '');
                }
              }}
            />
          )}
          defaultValue={(data && data[field.name]) ?? 0}
          name={field.name}
          label={field.label}
          control={control}
          error={!!error}
          rules={rules}
        />
      );
      break;

    case FieldType.options:
      if (!Array.isArray(field.options)) {
        return <FieldAutocomplete field={field} error={error} rules={rules} form={form} />;
      } else {
        return (
          <FormControl variant={variant} fullWidth={true}>
            <InputLabel>{field.label + (field.rules?.required === true ? ' *' : '')}</InputLabel>
            <Controller
              control={control}
              name={field.name}
              id={field.name}
              error={!!error}
              disabled={field.disabled}
              rules={rules}
              defaultValue={(data && data[field.name]) ?? ''}
              render={(props) => (
                <>
                  <Select
                    label={field.label}
                    value={props.value}
                    error={error}
                    onChange={(e) => {
                      props.onChange(e?.target?.value ?? null);
                      field.onChange && field.onChange(e?.target?.value, form);
                    }}
                    disabled={field.disabled}
                    multiple={field.multiple}
                  >
                    {field.options.map((elem, index) => (
                      <MenuItem key={index} value={elem.value}>
                        {elem.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
            {error && <FormHelperText className={'Mui-error'}>{error}</FormHelperText>}
          </FormControl>
        );
      }
      break;

    case FieldType.boolean:
      return (
        <FormControlLabel
          control={
            <Controller
              error={!!error}
              rules={rules}
              helperText={error}
              variant={variant}
              fullWidth={true}
              label={field.label + (field.rules?.required === true ? ' *' : '')}
              render={(props) => (
                <Checkbox
                  onChange={(event) => {
                    form.setValue(field.name, event.target.checked);
                    field.onChange && field.onChange(event.target.checked, form);
                  }}
                  checked={props.value}
                />
              )}
              valueName="checked"
              name={field.name}
              control={control}
              color="primary"
              disabled={field.disabled}
              defaultValue={data[field.name] || false}
            />
          }
          label={field.label}
        />
      );
      break;
    case FieldType.radio:
      return (
        <FormControlLabel
          label={''}
          control={
            <Controller
              error={!!error}
              rules={rules}
              helperText={error}
              variant={variant}
              fullWidth={true}
              label={field.label}
              render={(props) => (
                <Box>
                  <RadioGroup
                    name={field.name}
                    onChange={(event) => {
                      form.setValue(field.name, event.target.value);
                      field.onChange && field.onChange(event.target.value, form);
                    }}
                    value={props.value}
                  >
                    <FormLabel component="legend">{field.label}</FormLabel>
                    {field.options?.map((opt, i) => {
                      return (
                        <FormControlLabel
                          value={opt.value}
                          control={<Radio />}
                          label={opt.label}
                          key={i}
                        />
                      );
                    })}
                  </RadioGroup>
                  <FormHelperText style={{ color: 'red' }}>{error}</FormHelperText>
                </Box>
              )}
              valueName="checked"
              name={field.name}
              control={control}
              color="primary"
              disabled={field.disabled}
              defaultValue={data[field.name] || false}
            />
          }
        />
      );
      break;
    case FieldType.file:
      return (
        <Controller
          render={(props) => (
            <FileInput
              label={field.label + (field.rules?.required === true ? ' *' : '')}
              name={field.name}
              accept={field.accept || ''}
              multiple={field.multiple}
              error={error}
              value={props.value}
              max={field.rules.max}
              onChange={field.onChange}
              methods={form}
              onRemove={(file) => {
                field.onRemove && field.onRemove(file);
              }}
            />
          )}
          defaultValue={(data && data[field.name]) ?? null}
          name={field.name}
          label={field.label}
          control={control}
          error={!!error}
          rules={rules}
        />
      );
      break;
    case FieldType.br:
      return <br></br>;
      break;
    default:
      return (
        <Controller
          render={(props) => (
            <>
              <FormControl variant={variant} fullWidth={true}>
                {/* <InputLabel htmlFor={field.name}>
                  {field.label}
                </InputLabel> */}
                <TextField
                  error={!!error}
                  label={field.label + (field.rules?.required === true ? ' *' : '')}
                  placeholder={field.label}
                  name={field.name}
                  id={field.name}
                  variant={variant}
                  fullWidth={true}
                  helperText={error || field.help}
                  inputRef={props.ref}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    field.onChange && field.onChange(e.target.value, form);
                  }}
                  disabled={field.disabled}
                  // value={(data && data[field.name]) ?? ''}
                  value={props.value}
                  InputProps={inputProps}
                />
              </FormControl>
            </>
          )}
          // value={(data && data[field.name]) ?? ''}
          defaultValue={(data && data[field.name]) ?? ''}
          name={field.name}
          label={field.label}
          control={control}
          error={!!error}
          rules={rules}
        />
      );
      break;
  }
}
