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
export default function CheckOut(props) {
    


    return (
        <React.Fragment>
            <h1>Finish Submitting Your Requests</h1>
            <Grid container spacing={0}>
            
                <Grid
                container
                spacing={2}
                direction="row"
                item sm={12}
                alignItems="stretch"
                
               

            >
                {Object.keys(props.cart).map(function (wfKey) {
                    console.log(props.config.reasons);
                        var wf = props.cart[wfKey];
                        return (<Grid  item   xs={12}  key={wf.uuid} sx={{ mt: 4, mb: 4 }}>
                            <Card variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column',height: "100%"}}>
                                <CardHeader title={wf.label}></CardHeader>
                                <CardContent > 
                                
                                <Typography variant="body1">
                                {wf.description}
                                </Typography>
                                {(props.config.requireReasons && ! props.config.reasonIsList ? <TextField label="Reason for request" fullWidth margin="normal"  value={wf.reason}/> : "") }
                                {(props.config.requireReasons && props.config.reasonIsList ? 
                                    <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Reason for request</InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      
                                      label="Reason for request"
                                      
                                    >
                                    {
                                        
                                        props.config.reasons.map(function (reason) {
                                            
                                            return <MenuItem value={reason}>{reason}</MenuItem>
                                        })
                                    }
                                    
                                    </Select>
                                  </FormControl>
                                    
                                    : "") }
                                    

                                </CardContent>
                                <CardActions>
                                <Button variant="contained" onClick={(event) => {
                                        props.removeWorkflowFromCart(wf);
                                    }} >Remove from Cart</Button>
                                   
                                    
                                </CardActions>
                            </Card>
                        </Grid>);
                    



                    
                    
                })};
            </Grid>
                </Grid>
        
        </React.Fragment>
    );
}