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
import configData from './config/config.json'

export default function Approvals(props) {



    return (
        <React.Fragment>


            <h1>Your Open Approvals</h1>

            <Grid container spacing={0}>

                <Grid
                    container
                    spacing={2}
                    direction="row"
                    item sm={12}
                    alignItems="stretch"



                >
                    {props.approvals.open.map(function (approval) {

                        

                        return (<Grid item xs={12} key={approval.approval} sx={{ mt: 4, mb: 4 }}>
                            <Card variant="outlined" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: "100%" }}>
                                <CardHeader title={approval.label}></CardHeader>
                                <CardContent >
                                    <TextField
                                        label="For User"
                                        disabled={true}
                                        fullWidth
                                        margin="normal"
                                        defaultValue={approval.displayName}

                                        sx={{
                                            "& fieldset": { border: 'none' },
                                        }}
                                    />
                                    <TextField
                                        label="Open Since"
                                        disabled={true}
                                        fullWidth
                                        margin="normal"
                                        defaultValue={new Date(approval.approvalStart).toLocaleString()}

                                        sx={{
                                            "& fieldset": { border: 'none' },
                                        }}
                                    />
                                    <Typography variant="body1">

                                        {approval.wfDescription}

                                    </Typography>


                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" onClick={(event) => {

                                        fetch(configData.SERVER_URL + "main/approvals/" + approval.approval)
                                            .then(response => {
                                                return response.json();
                                            })
                                            .then(dataApproval => {
                                                console.log(dataApproval);
                                                props.setCurrentApproval(dataApproval);
                                                props.chooseScreenHandler('current-approval');
                                            });


                                    }} >Act on Request</Button>


                                </CardActions>
                            </Card>
                        </Grid>);






                    })};
                </Grid>

            </Grid>

        </React.Fragment>
    );
}