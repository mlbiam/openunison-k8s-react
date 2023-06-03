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

export default function CheckOut(props) {
    


    return (
        <React.Fragment>
            <h1>Finish Submitting Your Requests</h1>
            <Grid container spacing={0}>
                <Grid item sm={12}>
                <Grid
                container
                spacing={2}
                direction="row"
                
                alignItems="stretch"
                
               

            >
                {Object.keys(props.cart).map(function (wfKey) {
                        var wf = props.cart[wfKey];
                        return (<Grid  item   xs={12}  key={wf.uuid} sx={{ mt: 4, mb: 4 }}>
                            <Card variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column',height: "100%"}}>
                                <CardHeader title={wf.label}></CardHeader>
                                <CardContent > 
                                
                                <Typography variant="body1">
                                {wf.description}
                                </Typography>
                                    

                                </CardContent>
                                <CardActions>
                                <Button variant="contained" onClick={(event) => {
                                        props.updateCart(event,wf);
                                    }} >{(props.cart[wf.uuid] ? "Remove from Cart" : "Add to Cart")}</Button>
                                   
                                    
                                </CardActions>
                            </Card>
                        </Grid>);
                    



                    
                    
                })};
            </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}