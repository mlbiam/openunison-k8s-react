import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CardActionArea, CardHeader } from '@mui/material';
import configData from './config/config.json'


export default function AccessWorkflows(props) {
    return (
        <React.Fragment>
            <Grid
                container
                spacing={2}
                direction="row"
                
                alignItems="stretch"
                
               

            >
                {props.access.wfs.map(function (wf) {
                        
                        return (<Grid  item   xs={12} sm={6}   lg={4}  key={wf.uuid} sx={{ mt: 4, mb: 4 }}>
                            <Card variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column',height: "100%"}}>
                                <CardHeader title={wf.label}></CardHeader>
                                <CardContent > 
                                
                                <Typography variant="body1">
                                {wf.description}
                                </Typography>
                                    

                                </CardContent>
                                <CardActions>
                                <Button variant="contained" 
                                fullWidth
                                sx={{
                                    minHeight: "4rem", // adjust as needed (usually ~2x normal height)
                                }}
                                onClick={(event) => {
                                        props.updateCart(event,wf);
                                    }} >{(props.cart[wf.uuid] ? "Remove " + wf.label + " from Cart" : "Add " + wf.label + " to Cart")}</Button>
                                   
                                    
                                </CardActions>
                            </Card>
                        </Grid>)
                    



                    
                    
                })}
            </Grid>
        </React.Fragment>
    )
}