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
import OpsWorkflow from './OpsWorkflow';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import configData from './config/config.json'


export default function CheckOut(props) {
    const [forceRedraw, setFoceRedraw] = React.useState(Math.random);
    
    const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState("Submitting your requests...");
    const [dialogText, setDialogText] = React.useState("Submitting your requests...");
    const [showDialogButton,setShowDialogButton] = React.useState(false);
    const [showDialogProgress,setShowDialogProgress] = React.useState(true);

    const [submitRequestErrors, setSubmitRequestErrors] = React.useState([]);
    const [submitRequestSuccess, setSubmitRequestSuccess] = React.useState([]);
    const [onYesAction,setOnYesAction] = React.useState();
    const [submitRequestSuccessTitle,setSubmitSuccessTitle] = React.useState("Your requests have been submitted");

    function setWorkflow(wf) {
        var lwf = {...wf};
        props.replaceWorkflowInCart(wf);

    }

    function removeWorkflowButton(wf) {
        return <Button variant="contained" onClick={(event) => {
            //props.removeWorkflowFromCart(wf);
            

            
            showDialog("Remove Workflow from cart?","Remove the workflow " + wf.label + " from your cart?",true,false,() => {
                props.removeWorkflowFromCart(wf);
                setSubmitSuccessTitle("Your cart has been updated:");
                setSubmitRequestSuccess(["Request " + wf.label + " removed from your cart"]);
                closeDialog();
                props.setLoadedStatus("Request " + wf.label + " removed from your cart");
            });
        }} >Remove from Cart</Button>
    }

    function showDialog(title, text, showButtons,showProgress, clickYesAction) {
        setDialogText(text);
        setDialogTitle(title);
        setShowDialogButton(showButtons);
        setShowDialogProgress(showProgress);
        setOnYesAction(() => clickYesAction);
        setShowSubmitDialog(true);
    }

    function closeDialog() {
        setShowSubmitDialog(false);
    }

    return (
        <React.Fragment>
            <Dialog
                open={showSubmitDialog}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogText}
                        { showDialogProgress ? <LinearProgress /> : ""}
                    </DialogContentText>
                </DialogContent>
                {showDialogButton ?
                    <DialogActions>
                        <Button variant='contained' onClick={(event => {onYesAction()})}>Yes</Button>
                        <Button variant='contained' autoFocus onClick={event => {
                            closeDialog();
                        }} >No</Button>
                    </DialogActions> : ""}
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
                    <b>{submitRequestSuccessTitle}</b>
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

                        return (
                            <Grid item xs={12} key={wf.uuid} sx={{ mt: 4, mb: 4 }}>
                                <OpsWorkflow  wf={wf} config={props.config} setShowSubmitDialog={setShowSubmitDialog} setWorkflow={setWorkflow} submitRequestSuccess={submitRequestSuccess} submitRequestErrors={submitRequestErrors} wfButton={removeWorkflowButton} fromCheckout={true} />
                            </Grid>);






                    })}
                </Grid>
                { (Object.keys(props.cart).length > 0) ? 
                <Button variant="contained" size="large"   onClick={(event) => {
                    // show dialog
                    setSubmitSuccessTitle("Your requests have been submitted");
                    showDialog("Submit requests from your cart","Submitting the requests from your cart...",false,true,() => {});

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



                            if (wf.delegate && wf.subject) {
                                wfrequest.subjects = wf.subject.split("\n");
                            }

                            if (wf.tryPreApprove) {
                                wfrequest.doPreApproval = true;
                                wfrequest.approved = (wf.approved ? "true" : "false");
                                wfrequest.approvalReason = wf.approvalReason;
                            }



                            wfRequests.push(wfrequest);
                        }
                    )

                    const requestOptions = {
                        mode: "cors",
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(wfRequests)
                    }

                    fetch(configData.SERVER_URL + "main/workflows", requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            var wfSuccess = [];
                            var wfError = [];
                            var wfToRemove = [];

                            Object.keys(data).map((wfid) => {
                                var result = data[wfid];
                                if (result == "success") {
                                    wfSuccess.push(props.cart[wfid].label);
                                    wfToRemove.push(props.cart[wfid]);
                                    
                                } else {
                                    wfError.push(props.cart[wfid].label + ' - ' + result);
                                }
                            });

                            props.removeWorkflowsFromCart(wfToRemove);

                            

                            setSubmitRequestSuccess(wfSuccess);
                            setSubmitRequestErrors(wfError);
                            closeDialog();
                        })
                }} startIcon={<ConfirmationNumberIcon />}>Submit Your Requests</Button> : "" }
            </Grid>

        </React.Fragment>
    );
}