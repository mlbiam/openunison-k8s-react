import * as React from 'react';
import Title from './Title'
import { Typography } from '@mui/material';
import configData from './config/config.json'

export default function OrgInfo(props) {
  return (
    <React.Fragment>
        <Title>{props.org.name}</Title>
        <Typography>{props.org.description}</Typography>
        
    </React.Fragment>
  );
}