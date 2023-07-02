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
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function CheckOut(props) {
    const [forceRedraw, setFoceRedraw] = React.useState(Math.random);
    const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
    const [submitRequestErrors, setSubmitRequestErrors] = React.useState([]);
    const [submitRequestSuccess, setSubmitRequestSuccess] = React.useState([]);

    return (
        <React.Fragment>
            <Dialog
                open={showSubmitDialog}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Submitting your requests..."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Submitting your requests...
                        <LinearProgress />
                    </DialogContentText>
                </DialogContent>
            </Dialog>

            <h1>Finish Submitting Your Requests</h1>
            {(submitRequestErrors.length > 0 ?
                <Alert severity="error">
                    <b>There was a problem submitting your requests:</b>
                    <ul>
                        {
                            submitRequestErrors.map((msg) => {
                                return <li>{msg}</li>
                            })
                        }
                    </ul>
                </Alert>

                : "")}
            {(submitRequestSuccess.length > 0 ?
                <Alert severity="success">
                    <b>Your requests have been submitted:</b>
                    <ul>
                        {
                            submitRequestSuccess.map((msg) => {
                                return <li>{msg}</li>
                            })
                        }
                    </ul>
                </Alert>

                : "")}
            <Grid container spacing={0}>

                <Grid
                    container
                    spacing={2}
                    direction="row"
                    item sm={12}
                    alignItems="stretch"



                >
                    {Object.keys(props.cart).map(function (wfKey) {

                        var wf = props.cart[wfKey];
                        if (!wf.reason) {
                            wf.reason = "";
                        }

                        return (<Grid item xs={12} key={wf.uuid} sx={{ mt: 4, mb: 4 }}>
                            <Card variant="outlined" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: "100%" }}>
                                <CardHeader title={wf.label}></CardHeader>
                                <CardContent >

                                    <Typography variant="body1">
                                        {wf.description}
                                    </Typography>
                                    {(props.config.requireReasons && !props.config.reasonIsList ? <TextField label="Reason for request" fullWidth margin="normal" onChange={(event) => { wf.reason = event.target.value; }} /> : "")}
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

                                        : "")}
                                    {(wf.canDelegate) ?
                                        <Stack>
                                            <FormControlLabel control={<Checkbox checked={wf.delegate} onClick={event => { wf.delegate = event.target.checked; setFoceRedraw(Math.random()) }} />} label="Request For Someone Else" />
                                            {(wf.delegate) ?
                                                <TextField

                                                    label={"Requesting for - List each " + props.config.uidAttributeName}
                                                    multiline
                                                    rows={10}
                                                    defaultValue={wf.subject}
                                                    onChange={event => { wf.subject = event.target.value; setFoceRedraw(Math.random()) }}
                                                />
                                                : ""}

                                            {(wf.delegate && wf.canPreApprove) ?
                                                <FormControlLabel control={<Checkbox checked={wf.tryPreApprove} onClick={event => { wf.tryPreApprove = event.target.checked; setFoceRedraw(Math.random()) }} />} label="Attempt Pre-approval?" />
                                                : ""}

                                            {(wf.delegate && wf.canPreApprove && wf.tryPreApprove) ?
                                                <RadioGroup
                                                    defaultValue={wf.approved}                                                >
                                                    <FormControlLabel value="true" control={<Radio onClick={event => { wf.approved = "true" ; setFoceRedraw(Math.random())}} />} label="Approved" />
                                                    <FormControlLabel value="false" control={<Radio onClick={event => { wf.approved = "false" ; setFoceRedraw(Math.random())}} />} label="Denied" />
                                                </RadioGroup>
                                                : ""}

                                            {(wf.delegate && wf.canPreApprove && wf.tryPreApprove) ?
                                                <TextField

                                                label={"Reason for " + (wf.approved == "true" ? "approval" : "denial")}
                                              
                                                defaultValue={wf.approvalReason}
                                                onChange={event => { wf.approvalReason = event.target.value; setFoceRedraw(Math.random()) }}
                                            />
                                                : ""}

                                        </Stack>
                                        : ""}


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
                <Button onClick={(event) => {
                    // show dialog
                    setShowSubmitDialog(true);

                    // create the payload
                    var wfRequests = [];
                    Object.keys(props.cart).map(
                        (wfuuid) => {
                            var wf = props.cart[wfuuid];
                            var wfrequest = {}
                            wfrequest.uuid = wfuuid;
                            wfrequest.name = wf.name;
                            wfrequest.reason = wf.reason;
                            wfrequest.encryptedParams = wf.encryptedParams;


                            wfRequests.push(wfrequest);
                        }
                    );

                    const requestOptions = {
                        mode: "cors",
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(wfRequests)
                    };

                    fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/workflows", requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            var wfSuccess = [];
                            var wfError = [];

                            Object.keys(data).map((wfid) => {
                                var result = data[wfid];
                                if (result == "success") {
                                    wfSuccess.push(props.cart[wfid].label);
                                    props.removeWorkflowFromCart(props.cart[wfid]);
                                } else {
                                    wfError.push(props.cart[wfid].label + ' - ' + result);
                                }
                            });


                            console.log(wfError);

                            setSubmitRequestSuccess(wfSuccess);
                            setSubmitRequestErrors(wfError);
                            setShowSubmitDialog(false);
                        });
                }}>Submit Your Requests</Button>
            </Grid>

        </React.Fragment>
    );
}