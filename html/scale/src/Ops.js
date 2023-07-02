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

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import Alert from '@mui/material/Alert';
import { Checkbox } from '@mui/material';



export default function Ops(props) {
    const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
    const [submitRequestErrors, setSubmitRequestErrors] = React.useState([]);
    const [submitRequestSuccess, setSubmitRequestSuccess] = React.useState(false);
    const [selectedBase,setSelectedBase] = React.useState(props.opsConfig.searchBases[0]);
    const [forceRedraw, setFoceRedraw] = React.useState(Math.random);

    function displayName(config, user) {
        for (var i = 0; i < user.attributes.length; i++) {
            if (user.attributes[i].name == config.displayNameAttribute) {
                return user.attributes[i].values[0];
            }
        }
    }

    

    return (
        <React.Fragment>
            <Dialog
                open={showSubmitDialog}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Submitting Requests</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Submitting requests...
                        <LinearProgress />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Stack spacing={(2)}>
                <h2>{props.config.frontPage.title}</h2>
                {props.config.frontPage.text}
                <FormControl fullWidth>
                    <InputLabel id="searchBaseLabel">Search Base</InputLabel>
                    <Select
                        labelId="searchBaseLabel"
                        id="searchBase"
                        value={selectedBase}
                        label="Search Base"
                        onChange={event => {
                            setSelectedBase(event.target.value)
                        }}

                    >
                        {

                            props.opsConfig.searchBases.map(function (base) {

                                return <MenuItem key={base} value={base}>{base}</MenuItem>
                            })
                        }

                    </Select>
                </FormControl>
                <Grid container alignContent="center" alignItems="center">
                    { props.opsConfig.searchableAttributes.map(attrCfg => {
                        return <Grid item xs={12} md={3} alignItems="center" alignContent="center" display="flex">
                            <Checkbox checked={attrCfg.picked} onClick={event => {attrCfg.picked = event.target.checked;setFoceRedraw(Math.random)}} />
                            <TextField label={attrCfg.label}  margin="normal" value={attrCfg.value} onChange={(event) => { attrCfg.value = event.target.value;setFoceRedraw(Math.random) }} />
                        </Grid>
                    })
                    
                    }
                </Grid>
            </Stack>
            
        </React.Fragment>
    );
}
