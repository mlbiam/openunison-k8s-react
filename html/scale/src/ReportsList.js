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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ReportsList(props) {
    const [showSubmitDialog,setShowSubmitDialog] = React.useState(false);
    const [showParamsDialog,setShowParamsDialog] = React.useState(false);
    const [selectedReport,setSelectedReport] = React.useState({"parameters":[]});
    

    const [reportUserName,setReportUserName] = React.useState("");
    const [beginDate,setBeginDate] = React.useState(0);
    const [endDate,setEndDate] = React.useState(0);
    const [enablesubmitReport,setEnableSubmitReport] = React.useState(false);


    function checkIfCanSubmitReport() {
        console.log(beginDate)
        var allCnditionsSet = true;
        if (selectedReport.parameters.indexOf("userKey") >= 0) {
            allCnditionsSet = allCnditionsSet && reportUserName.length > 0;
        }

        if (selectedReport.parameters.indexOf("beginDate") >= 0) {
            allCnditionsSet = allCnditionsSet && beginDate > 0;
        }

        if (selectedReport.parameters.indexOf("endDate") >= 0) {
            allCnditionsSet = allCnditionsSet && endDate > 0;
        }

        setEnableSubmitReport(allCnditionsSet);

    }

    function loadReport(report) {
        setShowSubmitDialog(true);
        fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/reports/" + report.name)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise({});
            }
        })
        .then((json) => {
            props.setReport(json);
            setShowSubmitDialog(false);
        })
    }

    return (
        <React.Fragment>
           

           <Dialog
                open={showSubmitDialog}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Requesting Report...</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Requesting Report
                        <LinearProgress />
                    </DialogContentText>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showParamsDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            
                <DialogTitle id="alert-dialog-title">Report Parameters</DialogTitle>
                <DialogContent>
                    
                    <Stack spacing={2}>
                        
                        {selectedReport.parameters.indexOf("userKey") >= 0 ? <TextField label="User Name" fullWidth margin="normal" onChange={(event) => {
                            setReportUserName(event.target.value);
                            
                            var allCnditionsSet = true;

                            allCnditionsSet = allCnditionsSet && event.target.value.length > 0;

                            if (selectedReport.parameters.indexOf("beginDate") >= 0) {
                                allCnditionsSet = allCnditionsSet && beginDate > 0;
                            }
                    
                            if (selectedReport.parameters.indexOf("endDate") >= 0) {
                                allCnditionsSet = allCnditionsSet && endDate > 0;
                            }
                    
                            setEnableSubmitReport(allCnditionsSet);


                            }}/> : ""}
                        {selectedReport.parameters.indexOf("beginDate") >= 0  ?
                        
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker  label="Begin Date" labelId="begindate-label" onChange={(newValue) => {
                                
                                
                                if (newValue == null) {
                                    setBeginDate(0);
                                    setEnableSubmitReport(false);
                                    return;
                                }
                                
                                setBeginDate(newValue.unix() * 1000);
                                
                                var allCnditionsSet = true;
                                
                                if (selectedReport.parameters.indexOf("userKey") >= 0) {
                                    allCnditionsSet = allCnditionsSet && reportUserName.length > 0;
                                }

                                if (selectedReport.parameters.indexOf("endDate") >= 0) {
                                    allCnditionsSet = allCnditionsSet && endDate > 0;
                                }
                        
                                setEnableSubmitReport(allCnditionsSet);
                            }} />
                            </LocalizationProvider>
                        
                        : "" }
                        {selectedReport.parameters.indexOf("endDate") >= 0  ?
                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker  label="End Date" labelId="begindate-label" onChange={(newValue) => {
                            if (newValue == null) {
                                setEndDate(0);
                                setEnableSubmitReport(false);
                                return;
                            }

                            setEndDate(newValue.unix() * 1000);
                            
                            var allCnditionsSet = true;
                            
                            if (selectedReport.parameters.indexOf("userKey") >= 0) {
                                allCnditionsSet = allCnditionsSet && reportUserName.length > 0;
                            }

                            if (selectedReport.parameters.indexOf("beginDate") >= 0) {
                                allCnditionsSet = allCnditionsSet && beginDate > 0;
                            }
                    
                            setEnableSubmitReport(allCnditionsSet);
                        }} />
                        </LocalizationProvider>
                    
                    : "" }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={!enablesubmitReport} onClick={(event) => {

                        
                    }}>Request Report</Button>
                    <Button onClick={(event) => {
                        setReportUserName("");
                        setBeginDate(0);
                        setEndDate(0);
                        setShowParamsDialog(false);
                    }} autoFocus>
                        Cancel Request
                    </Button>
                </DialogActions>

            </Dialog>

            <Grid container spacing={0}>

                <Grid
                    container
                    spacing={2}
                    direction="row"
                    item sm={12}
                    alignItems="stretch"



                >
                    {props.reports.reports.map(function (report) {



                        return (<Grid item xs={12} key={report.name} sx={{ mt: 4, mb: 4 }}>
                            <Card variant="outlined" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: "100%" }}>
                                <CardHeader title={report.name}></CardHeader>
                                <CardContent >

                                    <Typography variant="body1">{report.description}</Typography>


                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" onClick={(event) => {

                                        if (report.parameters.length == 0) {
                                            loadReport(report);
                                        } else {
                                            setEnableSubmitReport(false);
                                            setSelectedReport({...report});
                                            setShowParamsDialog(true);
                                        }


                                    }} >Run</Button>


                                </CardActions>
                            </Card>
                        </Grid>);






                    })};
                </Grid>

            </Grid>

        </React.Fragment>
    );
}