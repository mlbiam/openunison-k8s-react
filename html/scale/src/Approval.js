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
import configData from './config/config.json'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';


export default function Approval(props) {
    
    
    var approval = props.currentApproval;
    const [justification,setJustification] = React.useState("");
    const [mustConfirm,setMustConfirm] = React.useState(false);
    const [approved,setApproved] = React.useState(false);


    const [showSubmitDialog,setShowSubmitDialog] = React.useState(false);
    const [submitRequestErrors,setSubmitRequestErrors] = React.useState([]);
    const [submitRequestSuccess,setSubmitRequestSuccess] = React.useState(false);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <React.Fragment>
            <Dialog
                open={showSubmitDialog}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Submitting {(approved ? "approval" : "denial")}...</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Submitting {(approved ? "approval" : "denial")}...
                        <LinearProgress />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            { (submitRequestErrors.length > 0 ? 
                <Alert severity="error">
                    <b>There was a problem submitting {approval.userObj.userID}'s {(approved ? "approval" : "denial")}:</b>
                    <ul>
                        {
                            submitRequestErrors.map((msg) => {
                                return <li>{msg}</li>
                            } )
                        }
                    </ul>
                </Alert>
                
                : "")}
            { (submitRequestSuccess > 0 ? 
                <Alert severity="success">
                    <b>{approval.userObj.userID}'s {(approved ? "approval" : "denial")} has been submitted</b>
                </Alert>
                
                : "")}
            

            <h2>Request Details</h2>
            <h3>Subject Information</h3>
            <Grid container spacing={0}>
                
                {Object.keys(props.config.attributes).map(attr => {
                    var attribute = props.config.attributes[attr];
                    if (approval.userObj.attribs[attribute.displayName]) {
                        return <React.Fragment><Grid item xs={12} md={4} key={attribute.displayName} ><b>{attribute.displayName}</b></Grid><Grid item xs={12} md={8}>{approval.userObj.attribs[attribute.displayName].values[0]}</Grid></React.Fragment>
                    }
                })}
                <Grid item xs={12} md={4} ><b>Name</b></Grid><Grid item xs={12} md={8}>{approval.wfLabel}</Grid>
                <Grid item xs={12} md={4} ><b>Description</b></Grid><Grid item xs={12} md={8}>{approval.wfDescription}</Grid>
                <Grid item xs={12} md={4} ><b>Open Since</b></Grid><Grid item xs={12} md={8}>{new Date(approval.approvalStart).toLocaleString()}</Grid>
                <Grid item xs={12} md={4} ><b>Subject's Request</b></Grid><Grid item xs={12} md={8}>{approval.label}</Grid>
                {(approval.reason && approval.reason.length > 0) ? (<React.Fragment><Grid item xs={12} md={4} ><b>Subject's Request Reason</b></Grid><Grid item xs={12} md={8}><pre>{approval.reason}</pre></Grid></React.Fragment>) : ""}
            </Grid>

            {(approval.requestAttributes && Object.keys(approval.requestAttributes).length > 0) ?
            <React.Fragment>
                <h2>Additional Request Details</h2>
                <Grid container spacing={0} component="dl">
                {
                    Object.keys(approval.requestAttributes).map(attrName => {
                        return <React.Fragment><Grid item xs={12} md={4} component="dt"><b>{attrName}</b></Grid><Grid item xs={12} md={8} component="dt">{approval.requestAttributes[attrName]}</Grid></React.Fragment>
                    })
                }
                </Grid>
            </React.Fragment>
            : ""
            }

            {(approval.userObj.attribs && Object.keys(approval.userObj.attribs).length > 0) ?
            <React.Fragment>
                <h2>Requester Details</h2>
                <Grid container spacing={0} >
                <Grid item xs={12} md={4}>
                <h3>Attributes</h3>
                <Grid container spacing={0} component="dl">
                {
                    Object.keys(approval.userObj.attribs).map(attrName => {
                        return <React.Fragment><Grid item xs={12} md={4} component="dt"><b>{attrName}</b></Grid><Grid item xs={12} md={8} component="dt">{approval.userObj.attribs[attrName].values[0]}</Grid></React.Fragment>
                    })
                }
                </Grid>
                
                </Grid>
                <Grid item xs={12} md={8}>
                    <h3>Current Roles</h3>


                    { props.config.groupsAreJson ? 
                    
                    <TableContainer>
                        <Table aria-label="group table">
                            <TableHead>
                                <TableRow key="header">
                                    {
                                        props.config.groupsFields.map(header => {
                                            return <StyledTableCell key={header} align="left">{header}</StyledTableCell>
                                        }

                                        )
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    JSON.parse(approval.userObj.groups).map(tblrow => {
                                        return  <StyledTableRow>
                                                    {
                                                        props.config.groupsFields.map(header => {
                                                            return <StyledTableCell>{tblrow[header]}</StyledTableCell>
                                                        })
                                                    }
                                                </StyledTableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                :
                    <List>
                {approval.userObj.groups.map(function (group) {
                    return (
                        <ListItemText key={group}>
                            <Card variant="outlined" >
                                <CardContent style={{ justifyContent: "left", display: "flex" }}>{group}</CardContent>

                            </Card>
                        </ListItemText>
                    );
                })}
            </List>
                }

                </Grid>
                </Grid>
            </React.Fragment>
            : ""
            }

            
            <h2>Act on Request</h2>
            <TextField   
                label="Justification"
                disabled={mustConfirm}
                fullWidth
                margin="normal"
                onChange={event => {
                    setJustification(event.target.value);
                }}
                
                
                />
            

            { !submitRequestSuccess ?
            <React.Fragment>
            { mustConfirm ?
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} style={{ justifyContent: "right", display: "flex" }}>
                    <Button variant="contained" color="secondary" fullWidth onClick={event => {
                        
                        if (justification == "") {
                            setSubmitRequestErrors(["Justification is required"]);
                            return;
                        }

                        var approvalData = {};
                        approvalData.reason = justification;
                        approvalData.approved = approved;

                        setShowSubmitDialog(true);

                        const requestOptions = {
                            mode: "cors",
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(approvalData)
                        };

                        fetch(configData.SERVER_URL + "main/approvals/" + approval.approval,requestOptions)
                        .then(response => {

                            if (response.status == 200) {
                                setSubmitRequestSuccess(true);
                                setShowSubmitDialog(false);
                                setSubmitRequestErrors([]);
                                props.loadOpenApprovals();
                                props.setLoadedStatus((approvalData.approved ? "Approval was submitted" : "Rejection was submitted"));
                                return Promise.resolve({});
                            } else {
                                return response.json();
                            }
                        })
                        .then(data => {
                            if (data.errors) {
                                props.setLoadedStatus((approvalData.approved ? "There were errors submitting your approval" : "There were errors submitting your rejection"));
                                setSubmitRequestErrors(data.errors);
                                setShowSubmitDialog(false);
                            }
                        }) 



                    }}>Confirm {approved ? "Approval" : "Denial"}</Button>
                </Grid>
                <Grid item xs={12} md={6}>
                <Button variant="outlined" color="secondary" fullWidth onClick={event => {
                    setApproved(false);
                    setMustConfirm(false);
                }}>Cancel {approved ? "Approval" : "Denial"}</Button>
                </Grid>
            </Grid> :
            <Grid container spacing={1}>
            <Grid item xs={12} md={6} style={{ justifyContent: "right", display: "flex" }}>
                <Button variant="contained" fullWidth onClick={event => {
                    setApproved(true);
                    setMustConfirm(true);
                }}>Approve Request</Button>
            </Grid>
                <Grid item xs={12} md={6}>
                    <Button variant="outlined" fullWidth onClick={event => {
                    setApproved(false);
                    setMustConfirm(true);
                }}>Deny Request</Button>
                </Grid>
            </Grid>

            }
            </React.Fragment>
            : "" }         
                    



                    
                    
                
           
            
               
        
        </React.Fragment>
    );
}