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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import configData from './config/config.json'

export default function OpsWorkflow(props) {
    const [forceRedraw, setFoceRedraw] = React.useState(Math.random);
    
    const [submitRequestErrors, setSubmitRequestErrors] = React.useState([]);
    const [submitRequestSuccess, setSubmitRequestSuccess] = React.useState([]);
    const [localWf,setLocalWf] = React.useState({...props.wf,"approved":false,  "tryPreApprove": props.wf.tryPreApprove ? true : false,"delegate":false,"showPreApprove": props.wf.showPreApprove ? true : false})

    function updateWorkflow(wf) {
        setLocalWf(wf);
        if (props.setWorkflow) {
            props.setWorkflow(wf);
        }
    }

    return (
        
                        <Card variant="outlined" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: "100%" }}>
                            <CardHeader title={localWf.label}></CardHeader>
                            <CardContent >
                                <Stack>
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


                                    <Typography variant="body1">
                                        {localWf.description}
                                    </Typography>
                                    {(props.config.requireReasons && !props.config.reasonIsList ? <TextField label="Reason for request" fullWidth margin="normal" onChange={(event) => {  var nwf = {...localWf};  nwf.reason = event.target.value; updateWorkflow(nwf)}} /> : "")}
                                    {(props.config.requireReasons && props.config.reasonIsList ?
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Reason for request</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"

                                                label="Reason for request"
                                                onChange={event =>{
                                                    var nwf = {...localWf};
                                                    nwf.reason = event.target.value;
                                                }}
                                            >
                                                {

                                                    props.config.reasons.map(function (reason) {

                                                        return <MenuItem value={reason}>{reason}</MenuItem>
                                                    })
                                                }

                                            </Select>
                                        </FormControl>

                                        : "")}
                                        {! props.cart && localWf.canDelegate ? <React.Fragment>
                                        
                                        <FormControlLabel control={<Checkbox checked={localWf.delegate} value={localWf.delegate} onClick={event => {  var nwf={...localWf};  nwf.delegate = event.target.checked; updateWorkflow(nwf) }} />} label="Request For Someone Else" />
                                        {(localWf.delegate) ?
                                                <TextField

                                                    label={"Requesting for - List each " + props.config.uidAttributeName}
                                                    multiline
                                                    rows={10}
                                                    defaultValue={localWf.subject}
                                                    onChange={event => { var nwf={...localWf};nwf.subject = event.target.value; updateWorkflow(nwf) }}
                                                />
                                                : ""}</React.Fragment> : "" }

                                    {( ((props.fromCheckout && localWf.delegate) || (! props.fromCheckout)) && localWf.canPreApprove && localWf.showPreApprove ) ?
                                        <FormControlLabel control={<Checkbox checked={
                                            localWf.tryPreApprove
                                        } value={localWf.tryPreApprove} onClick={event => {  var nwf = {...localWf};  nwf.tryPreApprove = event.target.checked; updateWorkflow(nwf); }} />} label="Attempt Pre-approval?" />
                                        : ""}

                                    {(((props.fromCheckout && localWf.delegate) || (! props.fromCheckout)) && localWf.canPreApprove && localWf.tryPreApprove) ?
                                        <RadioGroup
                                            value={localWf.approved}     
                                            onChange={event => {
                                                var nwf = {...localWf};
                                                nwf.approved = event.target.value == "true";
                                                updateWorkflow(nwf);
                                            }}
                                            >
                                            <FormControlLabel value={true} control={<Radio value={true} />} label={localWf.approvedLabel} />
                                            <FormControlLabel value={false} control={<Radio value={false} />} label={localWf.deniedLabel} />
                                        </RadioGroup>
                                        : ""}

                                    {(((props.fromCheckout && localWf.delegate) || (! props.fromCheckout)) && localWf.canPreApprove && localWf.tryPreApprove) ?
                                        <TextField

                                            label={(localWf.approved == true ? localWf.reasonApprovedLabel : localWf.reasonDeniedLabel)}

                                            defaultValue={localWf.approvalReason}
                                            onChange={event => { var nwf = {...localWf};  nwf.approvalReason = event.target.value; updateWorkflow(nwf) }}
                                        />
                                        : ""}
                                    { props.wfButton ? props.wfButton(localWf) : 
                                    <Button onClick={(event) => {
                                        // show dialog
                                        props.setShowSubmitDialog(true);

                                        // create the payload
                                        var wfRequests = [];
                                                
                                        var wfrequest = {}
                                        wfrequest.uuid = localWf.uuid;
                                        wfrequest.name = localWf.name;
                                        wfrequest.reason = localWf.reason;
                                        wfrequest.subjects = [];

                                        Object.keys(props.cart).map((resultDN) => {
                                            var row = props.cart[resultDN];

                                            
                                                wfrequest.subjects.push(row[props.config.uidAttributeName]);
                                            

                                            
                                        });

                                        if (localWf.tryPreApprove) {
                                            wfrequest.doPreApproval = true;
                                            wfrequest.approved = (localWf.approved ? "true" : "false");
                                            wfrequest.approvalReason = localWf.approvalReason;
                                        }

                                        wfrequest.encryptedParams = localWf.encryptedParams;
                                        wfRequests.push(wfrequest);
                                        
                                        const requestOptions = {
                                            mode: "cors",
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(wfRequests)
                                        };

                                        fetch(configData.SERVER_URL + "main/workflows", requestOptions)
                                            .then(response => response.json())
                                            .then(data => {
                                                var wfSuccess = [];
                                                var wfError = [];

                                                Object.keys(data).map((wfid) => {
                                                    var result = data[wfid];
                                                    if (result == "success") {
                                                        wfSuccess.push(localWf.label);
                                                        
                                                    } else {
                                                        wfError.push(localWf.label + ' - ' + result);
                                                    }
                                                });


                                        
                                                if (props.setSubmitRequestSuccess) {
                                                    props.setSubmitRequestSuccess(wfSuccess);
                                                    props.setSubmitRequestErrors(wfError);
                                                } else {
                                                    setSubmitRequestSuccess(wfSuccess);
                                                    setSubmitRequestErrors(wfError);
                                                }


                                                
                                                props.setShowSubmitDialog(false);
                                            });
                                    }} disabled={(localWf.tryPreApprove &&  (! localWf.approvalReason || localWf.approvalReason == ""))} variant="contained" >Submit Your Request for {localWf.label}</Button> }
                                </Stack>



                            </CardContent>
                            <CardActions>



                            </CardActions>
                        </Card>
 






              
    );
}