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
import OpsWorkflow from './OpsWorkflow';


export default function OpsWorkflows(props) {
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



            <Grid
                container
                spacing={2}
                direction="row"

                alignItems="stretch"



            >
                {props.access.wfs.map(function (wf) {

                    if (wf["canDelegate"]) return (<Grid item xs={12} sm={8} lg={6} key={wf.uuid} sx={{ mt: 4, mb: 4 }}>
                        <OpsWorkflow wf={wf} config={props.config} setShowSubmitDialog={setShowSubmitDialog} cart={props.cart}/>
                    </Grid>);






                })};
            </Grid>
        </React.Fragment>
    );
}