import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import SummarizeIcon from '@mui/icons-material/Summarize';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';

import Alert from '@mui/material/Alert';



export default function User(props) {

    const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
    const [submitRequestErrors, setSubmitRequestErrors] = React.useState([]);
    const [submitRequestSuccess, setSubmitRequestSuccess] = React.useState(false);

    function displayName(config, user) {
        for (var i = 0; i < user.attributes.length; i++) {
            if (user.attributes[i].name == config.displayNameAttribute) {
                return user.attributes[i].values[0];
            }
        }
    }

    function showUserAttributes(props) {
        if (props.config.canEditUser) {
            return <Stack spacing={0}>

                {(submitRequestErrors.length > 0 ?
                    <Alert severity="error">
                        <b>There was a problem submitting {displayName(props.config, props.user)}'s profile update:</b>
                        <ul>
                            {
                                submitRequestErrors.map((msg) => {
                                    return <li>{msg}</li>
                                })
                            }
                        </ul>
                    </Alert>

                    : "")}
                {(submitRequestSuccess > 0 ?
                    <Alert severity="success">
                        <b>{displayName(props.config, props.user)}'s profile update has been submitted</b>
                    </Alert>

                    : "")}

                {Object.keys(props.userObj.attributes).map(function (attrName) {
                    var attribute = props.userObj.attributes[attrName]




                    return <TextField id={attrName}
                        label={props.config.attributes[attrName].displayName}
                        disabled={props.config.attributes[attrName].readOnly}
                        fullWidth
                        margin="normal"
                        defaultValue={attribute}
                        onChange={(event) => {props.userObj.attributes[attrName] = event.target.value;}}


                    />
                }
                )}
                <Button onClick={(event => {
                    setShowSubmitDialog(true);

                    var newAttributes = {};
                    Object.keys(props.userObj.attributes).map(attrName => {
                        if (! props.config.attributes[attrName].readOnly) {
                            newAttributes[attrName] = {

                                "name": attrName,
                                "value": props.userObj.attributes[attrName]
                            }
                        }
                    });


                    const requestOptions = {
                        mode: "cors",
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newAttributes)
                    };

                    fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/user",requestOptions)
                        .then(response => {
                            if (response.status == 200) {
                                setSubmitRequestSuccess(true);
                                setShowSubmitDialog(false);
                                setSubmitRequestErrors([]);
                                
                                return Promise.resolve({});
                            } else {
                                return response.json();
                            }
                        })
                        .then(data => {
                            if (data.errors) {
                                setSubmitRequestErrors(data.errors);
                                setShowSubmitDialog(false);
                            }
                        })


                })} >Save</Button>
            </Stack>
        } else {
            return <Grid container spacing={0}>
                {Object.keys(props.userObj.attributes).map(function (attrName) {
                    var attribute = props.userObj.attributes[attrName]
                    return <React.Fragment><Grid item xs={12} md={4} ><b>{props.config.attributes[attrName].displayName}</b></Grid><Grid item xs={12} md={8}>{attribute}</Grid></React.Fragment>
                }
                )}
            </Grid>
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={showSubmitDialog}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Submitting {displayName(props.config, props.user)}'s profile...</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Submitting {displayName(props.config, props.user)}'s profile updates...
                        <LinearProgress />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <h2>{displayName(props.config, props.user)}'s Profile</h2>
            {/* contains two columns: attributes and groups*/}
            <Grid container
                direction="row"
            >

                {/* attributes */}
                <Grid item xs={12} sm={6} >
                    <h3>Attributes</h3>

                    {showUserAttributes(props)}






                </Grid>

                {/* groups */}
                <Grid item xs={12} sm={6} >
                    <h3>Roles</h3>
                    <List>
                        {props.userObj.currentGroups.map(function (group) {
                            return (
                                <ListItemText key={group}>
                                    <Card variant="outlined" >
                                        <CardContent style={{ justifyContent: "left", display: "flex" }}>{group}</CardContent>

                                    </Card>
                                </ListItemText>
                            );
                        })}
                    </List>
                </Grid>

            </Grid>
        </React.Fragment>
    );
}
