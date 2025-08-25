import * as React from 'react';
import { Component } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';

import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';

import theme from './theme';
import { useEffect, useState, useReducer, useRef, lazy } from 'react';
import { loadAttributes } from './tools/biz.js'
import configData from './config/config.json'
import Button from '@mui/material/Button';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

import NavList from './NavList';
import Title from './Title'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import { Interweave } from 'interweave';
import Switch from '@mui/material/Switch'

import ReCAPTCHA from "react-google-recaptcha"
import { visuallyHidden } from '@mui/utils';

//import RegisterFunctions from './register-functions.js'

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © Tremolo Security, Inc.'}
      <Link color="inherit" href="https://www.tremolosecurity.com/">
        https://wwww.tremolosecurity.com/
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const reducer = (state) => {
  
}


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);



const mdTheme = createTheme();



function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [pageName, setPageName] = React.useState('loading');

  const chooseScreenHandler = (screenName) => {
    setPageName(screenName);
  }

  const [config, setConfig] = React.useState({"config":  { "frontPage": { "title": "" }, "attributeNameList": [], "headerTitle": "OpenUnisonX" } } );
  const [userData, setUserData] = React.useState({"password1":"","password2":""} );

  

  const [dialogTitle, setDialogTitle] = React.useState("Loading");
  const [dialogText, setDialogText] = React.useState("Connecting to OpenUnison");
  const [dialogButtonLabel, setDialogButtonLabel] = React.useState("OK");
  const [dialogButtonFunction, setDialogButtonFunction] = React.useState(function () { });
  const [showDialog, setShowDialog] = React.useState(true);
  const [showDialogButton, setShowDialogButton] = React.useState(false);

  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
  const [submitRequestErrors, setSubmitRequestErrors] = React.useState([]);
  const [submitRequestSuccess, setSubmitRequestSuccess] = React.useState(false);

  const [extUrls, setExtUrls] = React.useState([]);
  const [saveEnabled, setSaveEnabled] = React.useState(true);
  const [scripts, setScripts] = React.useState([]);
  const [ouTheme,setOuTheme] = React.useState(theme);
  const [loadedStatus,setLoadedStatus] = React.useState("");
  
  



  const fetchData = () => {




    fetch(configData.SERVER_URL + "password/config")
      .then(response => {
        return response.json()
      })
      .then(dataConfig => {
        
        

        var localDataConfig = {...dataConfig};

        

        setConfig(localDataConfig);

        const deftheme = createTheme({
          palette: {
            primary: {
              main: dataConfig.config.themePrimaryMain,
              dark: dataConfig.config.themePrimaryDark,
              light: dataConfig.config.themePrimaryLight,
        
            },
            secondary: {
              main: dataConfig.config.themeSecondaryMain,
              dark: dataConfig.config.themeSecondaryDark,
              light: dataConfig.config.themeSecondaryLight,
            },
            error: {
              main: dataConfig.config.errorColor,
            },
            text: {
              secondary: '#525252',
            },
          },
          components: {
            MuiButton: {
              defaultProps: {
                disableRipple: true,
              },
            },
          },
        });

        setOuTheme(deftheme);

        
        setShowDialog(false);
        setLoadedStatus("Page loaded, ready to enter your password.");
        
      })
  }



  useEffect(() => {
    fetchData();
  }, [])



  

  return (
    <ThemeProvider theme={ouTheme}>
      <Dialog
        open={showDialog}

        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogText}
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
        {showDialogButton ?
          <DialogActions>

            <Button onClick={(event) => {
              extendSession();
            }} autoFocus>
              {dialogButtonLabel}
            </Button>
          </DialogActions> : ""}
      </Dialog>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} color="primary">
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}

          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              { config.config.headerTitle }
            </Typography>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <img src="images/logo-desktop.png" />
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />

          <NavList config={config} />


        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} >
            <Stack spacing={2}>
              <Title>{config.config.frontPage.title}</Title>
              {config.config.frontPage.text}

              {(submitRequestErrors.length > 0 ?
                <Alert severity="error">
                  <b>There was a problem submitting your request:</b>
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
                  <b>Your request has been submitted</b>
                </Alert>

                : "")}

                <TextField
                label="Password"
                type="password"
                value={userData.password1}
                onChange={event => { var localUserData = { ...userData }; localUserData.password1 = event.target.value; setUserData(localUserData)  }}
                 />

                <TextField
                label="Confirm Password"
                type="password"
                value={userData.password2}
                onChange={event => { var localUserData = { ...userData }; localUserData.password2 = event.target.value; setUserData(localUserData)  }}
                 />

              <Grid container spacing={2} >
                

              

                

              <Grid container spacing={2} >
                <Grid item xs={12} md={6} >
                  <Button fullWidth disabled={!saveEnabled} onClick={(event => {
                    setSaveEnabled(false);
                    setDialogTitle("Submitting Password Update");
                    setDialogText("Submitting your request");

                    setShowDialog(true);


                    



                    const requestOptions = {
                      mode: "cors",
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(userData)
                    };

                    fetch(configData.SERVER_URL + "password/submit", requestOptions)
                      .then(response => {
                        if (response.status == 200) {
                          setSubmitRequestSuccess(true);
                          setShowDialog(false);
                          setLoadedStatus("Your password was submitted.");
                          setSubmitRequestErrors([]);

                          return Promise.resolve({});
                        } else {
                          return response.json();
                        }
                      })
                      .then(data => {
                        if (data.errors) {
                          setSubmitRequestErrors(data.errors);
                          setSaveEnabled(true);
                        }

                        setShowDialog(false);
                        setLoadedStatus("Your password was submitted, but there were errors.");
                      })


                  })} >Submit Your New Password</Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button fullWidth disabled={!saveEnabled}
                    onClick={event => { window.location = config.homeURL; }}

                  >Cancel Password Update</Button>
                </Grid>
              </Grid>
              </Grid>
            </Stack>





            <Copyright sx={{ pt: 4 }} />
            <Typography aria-live="polite" role="status" sx={visuallyHidden}>
              {loadedStatus}
            </Typography>


          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
