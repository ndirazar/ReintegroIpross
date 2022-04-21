// Third-party imports
import { IconButton, InputLabel, Link, makeStyles, Typography } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { getFileName } from '../common/helpers';
import { useFormContext } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  helpText: {
    fontSize: '12px',
  },
  fileLink: {
    fontSize: '16px',
  },
}));
// Component
export default function FileInput(props) {
  const [clear, setClear] = useState(false);
  // const [fileName, setFileName] = useState('');
  // const [fileContent, setFileContent] = useState<File | string | File[] | string[]>(null);
  const [fileList, setFileList] = useState(props.value || []);
  const [showInput, setShowInput] = useState(true);
  const classes = useStyles();
  // const { reset, register, watch, setError, setValue, clearErrors } = methods;

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setClear(false);
    try {
      if (!props.multiple) {
        const reader = new FileReader();
        const file = target.files[0];
        // setFileName(file.name);
        reader.onload = () => {
          props.onReadData && props.onReadData({ result: reader.result.toString(), file });
        };
        // setFileContent(file);
        reader.readAsText(file);
        setFileList([file.name]);
        props.methods?.setValue(props.name, [file]);
        props.onChange && props.onChange(file, props.methods);
      } else {
        const faux = [];
        const list = [];
        Array.from(target.files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            props.onReadData && props.onReadData({ result: reader.result.toString(), file });
          };

          reader.readAsText(file);
          faux.push(file);
          list.push(file.name);
        });
        // setFileContent(faux);
        setFileList([...fileList, ...list]);
        props.methods?.setValue(props.name, faux);
        props.onChange && props.onChange(faux);
      }
    } catch (e) {
      //TODO some thing
    }
  };

  const removeFile = (file) => {
    if (typeof fileList === 'string') {
      setFileList([]);
    } else {
      const files = fileList.filter((f) => f !== file);
      setFileList(files);
    }
    // setFileName(null);
    // setFileContent(null);
    // setClear(true);
    props.onRemove && props.onRemove(file);
  };

  const getFileListItem = (file) => {
    return (
      <Typography className={classes.fileLink}>
        <Link href={file} target="_blank">
          {getFileName(file)}
        </Link>
        <IconButton
          onClick={() => {
            removeFile(file);
          }}
          color="default"
        >
          <Cancel />
        </IconButton>
      </Typography>
    );
  };

  const getFileList = () => {
    if (typeof fileList === 'string') {
      return <span>{getFileListItem(fileList)}</span>;
    }
    return fileList.map((file, i) => {
      return <span key={i}>{getFileListItem(file)}</span>;
    });
  };

  // useEffect(() => {
  //   if () {
  //     let files = props.value || [];
  //     if (props.value && typeof props.value === 'string') {
  //       files = [files];
  //     }
  //     setFileList(files);
  //   }
  // }, [props, fileList, setFileList]);

  useEffect(() => {
    setShowInput(
      (!props.multiple && fileList.length <= 0) ||
        (props.multiple && props.max && fileList.length < props.max),
    );
  }, [props, fileList, setShowInput]);

  return (
    <>
      {props.label && <InputLabel htmlFor={'file-input'}>{props.label}</InputLabel>}
      {showInput && (
        <input
          accept={props.accept}
          id="file-input"
          multiple={props.multiple}
          type="file"
          onChange={changeHandler}
        />
      )}
      {props.accept && (
        <Typography
          className={classes.helpText}
          color="textPrimary"
          variant="caption"
          display="block"
          gutterBottom
        >
          Archivos aceptados: {props.accept}
        </Typography>
      )}
      {props.error && (
        <Typography component="p" color="error">
          {props.error}
        </Typography>
      )}
      {getFileList()}
    </>
  );
}
