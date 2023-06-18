import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orgs from './Orgs';
import Links from './Links';
import OrgInfo from './OrgInfo';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardHeader } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Title from './Title';
import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Stack from '@mui/material/Stack';

export default function Report(props) {
    
    
    
    
    return (
        <React.Fragment>
            <Stack spacing={1}>
            <h2>{props.report.name}</h2>
            <h3>{props.report.description}</h3>
            {props.report.when}
            </Stack>
            
            var columns = [];
            props.report.dataFields.map(function(dataField) {
                columns.push(
                    {
                        field: dataField,
                        headerName: dataField
                    }
                )
            });
                    
            


            {
                props.report.grouping.map(function(dataset) {
                    console.log("here");
                    console.log(dataset.data);
                    return <React.Fragment>
                        
                        <Grid container spacing={0}>
                            {props.report.headerFields.map(function (headerField) {
                                return <React.Fragment><Grid item xs={12} md={4} ><b>{headerField}</b></Grid><Grid item xs={12} md={8}>{dataset.header[headerField]}</Grid></React.Fragment>
                            })}
                                                    
                            
                        </Grid>
                        <DataGrid
                            rows={dataset.data}
                            columns={columns}
                            
                        />
                    </React.Fragment>
                })
            }
            
                    



                    
                    
                
           
            
               
        
        </React.Fragment>
    );
}