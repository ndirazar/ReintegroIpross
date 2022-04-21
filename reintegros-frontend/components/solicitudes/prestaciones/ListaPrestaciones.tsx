import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@material-ui/core';
import { parseISO, format } from 'date-fns';
import React from 'react';
import { DATE_FORMAT } from '../../../labels';

export const ListaPrestacion = ({ buttons, prestaciones }) => {
  return (
    <Box>
      {prestaciones.length !== 0 && (
        <>
          <List component="nav">
            {prestaciones.map((prestacion, index) => {
              const item = prestacion?.item;
              return (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.codigo}-${item.descripcion} (${format(
                      parseISO(prestacion.fechaPractica),
                      DATE_FORMAT,
                    )} - $${prestacion?.valorPrestacion})`}
                  />
                  {buttons.map((button, i) => (
                    <ListItemSecondaryAction key={i}>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => button.action(index)}
                      >
                        {button.icon}
                      </IconButton>
                    </ListItemSecondaryAction>
                  ))}
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </>
      )}
    </Box>
  );
};
