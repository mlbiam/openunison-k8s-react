import * as React from 'react';
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
import NavList from './NavList.js'
import theme from './theme';
import FrontPage from './FrontPage';
import RequestAccess from './RequestAccess.js';
import User from './User'
import {useEffect, useState} from 'react';
import {loadAttributes } from './tools/biz.js'
import CheckOut from './CheckOut.js';
import Approvals from './Approvals.js';
import Approval from './Approval.js';
import Reports from './Reports.js';
import Report from './Report.js';
import Ops from './Ops.js';

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

  const [config,setConfig] = React.useState({}  );
  const [user,setUser] = React.useState({});
  const [userObj,setUserObj] = React.useState({"currentGroups":[],"attributes":{}})
  const [orgs,setOrgs] = React.useState({});
  const [links,setLinks] = React.useState({"urls":[]})
  const [cart,setCart] = React.useState({})
  const [orgsById,setOrgsById] = React.useState({})
  const [approvals,setApprovals] = React.useState({"open":[]});
  const [currentApproval,setCurrentApproval] = React.useState({});
  const [report,setReport] = React.useState({});
  const [enableOps,setEnableOps] = React.useState(false);
  const [opsConfig,setOpsConfig] = React.useState({});

  const [orgsForLinks,setOrgsForLinks] = React.useState({});
  const [orgsForLinksById,setOrgsForLinksById] = React.useState({});

  function addWorkflowToCart(wf) {
    var newCart = {...cart}

    fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/workflows/candelegate?workflowName=" + wf.name + "&uuid=" + wf.uuid)
    .then(response => {
      return response.json();
    })
    .then(json => {
      wf.canPreApprove = json.canPreApprove;
      wf.canDelegate = json.canDelegate;
      newCart[wf.uuid] = wf;
      setCart(newCart);
    })

    

  }

  function removeWorkflowFromCart(wf) {
    var newCart = {...cart}
    delete newCart[wf.uuid];
    setCart(newCart);
  }

  function loadOpenApprovals() {
    fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/approvals")
              .then(response => {
                return response.json();
              })
              .then(dataApprovals => {
                var newApprovals = {};
                newApprovals["open"] = dataApprovals.approvals.sort(
                  (a,b) => {
                    return (a.approvalStart - b.approvalStart);
                  }
                );

                setApprovals(newApprovals);
              }); 
  }

  const fetchData = () => {

    fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/ops/config")
      .then(response => {
        setEnableOps(response.ok);
        if (response.ok) {
          return response.json();
        } else {
          return Promise.resolve({});
        }
      })
      .then(data => {
        console.log("ops");
        console.log(data);
        setOpsConfig(data);
      });


    fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/config")
      .then(response => {
        return response.json()
      })
      .then(dataConfig => {
        setConfig(dataConfig);
        fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/user")
        .then(response => {
          return response.json()
        })
        .then(data => {
          setUser(data);
          var localUserObj = {"currentGroups":[],"attributes":{}};
          loadAttributes(localUserObj,data,dataConfig);   
          setUserObj(localUserObj);

          if (! dataConfig.showPortalOrgs) {
            fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/urls")
            .then(
              response => {
                return response.json()
              }
            ).then(
              dataLinks => {
                setLinks({"urls":dataLinks});
              }
            )
          }


          fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/orgs")
          .then(response => {
            return response.json()
          })
          .then(dataOrgs => {


            function loadLeaf(root,llocalOrgsById) {
              llocalOrgsById[root.id] = root;
              for (var i=0;i<root.subOrgs.length;i++) {
                loadLeaf(root.subOrgs[i],llocalOrgsById);
              }
            }

            console.log(dataOrgs)
            var localOrgsById = {};
            
            loadLeaf(dataOrgs,localOrgsById);



            // load URLs to sort into orgs

            fetch("https://k8sou.apps.192-168-2-14.nip.io/scalereact/main/urls")
            .then(
              response => {
                return response.json()
              }
            ).then(
              dataLinks => {
                
                var linkOrgs = JSON.parse(JSON.stringify(dataOrgs));
                var linksByOrg = {};
                dataLinks.map(url => {
                  if (! linksByOrg[url.org]) {
                    linksByOrg[url.org] = [];
                  }

                  linksByOrg[url.org].push(url)
                })

                function cleanTree(root) {
                  var toRemove = {};
                  root.subOrgs.map(childOrg => {
                    var hasChildren = childOrg.subOrgs.length > 0;
                    childOrg.links = linksByOrg[childOrg.id];
                    var hasLinks = childOrg.links && childOrg.links.length > 0;
                    if (! hasLinks) {
                      childOrg.links = [];
                    }
                    if (!hasChildren &&!hasLinks) {
                      toRemove[childOrg.id] = childOrg;
                    } else {
                      cleanTree(childOrg);
                    }



                    

                  }
                  
                  );
                  root.subOrgs = root.subOrgs.filter(subOrg => {return !toRemove[subOrg.id]})
                }

                cleanTree(linkOrgs);

                linkOrgs.links = linksByOrg[linkOrgs.id];
                if (! linkOrgs.links) {
                  linkOrgs.links = [];
                }

                var localLinkOrgsById = {};
                loadLeaf(linkOrgs,localLinkOrgsById);
                console.log(localLinkOrgsById);

                setOrgsForLinks(linkOrgs);
                setOrgsForLinksById(localLinkOrgsById);
                setPageName('front-page');
              }
            )

            setOrgsById(localOrgsById);
            setOrgs(dataOrgs);
            
          });

          if (dataConfig.enableApprovals) {
            loadOpenApprovals();
          }

        }) 
      })
  }

  useEffect(() => {
    fetchData()
  }, [])


  


  return (
    <ThemeProvider theme={theme}>
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
              OpenUnison
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
          
            <NavList user={user} config={config} userObj={userObj} chooseScreenHandler={chooseScreenHandler} pageName={pageName} cart={cart} approvals={approvals} enableOps={enableOps} />
            
          
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
            
            
         
            
          { pageName == 'front-page' ? (<FrontPage orgs={orgsForLinks} config={config} links={links} title={config.frontPage.title}  orgsById={orgsForLinksById}/>) : ("") }
          { pageName == 'user' ? (<User config={config} user={user} userObj={userObj} />) : ("") }
          { pageName == 'request-access' ? (<RequestAccess config={config} user={user} userObj={userObj} orgs={orgs} title={"Request Access"} addWorkflowToCart={addWorkflowToCart} removeWorkflowFromCart={removeWorkflowFromCart} cart={cart} orgsById={orgsById} />) : ("") }
          { pageName == 'checkout' ? (<CheckOut cart={cart} config={config} removeWorkflowFromCart={removeWorkflowFromCart} />) : ""}
          { pageName == 'approvals' ? (<Approvals approvals={approvals} setCurrentApproval={setCurrentApproval} chooseScreenHandler={chooseScreenHandler} />) : ""}
          { pageName == 'current-approval' ? (<Approval currentApproval={currentApproval} loadOpenApprovals={loadOpenApprovals} config={config}/> ) : "" }
          { pageName == 'reports' ? (<Reports config={config} user={user} userObj={userObj} orgs={orgs} title={"Reports"}  orgsById={orgsById} setReport={setReport} chooseScreenHandler={chooseScreenHandler} />) : ("") }
          { pageName == 'report' ? (<Report config={config} user={user} userObj={userObj} report={report}  /> ) : ""}
          { pageName == 'ops' ? (<Ops config={config} user={user} userObj={userObj} opsConfig={opsConfig} orgs={orgs} orgsById={orgsById} /> ) : ""}


            
            
            
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
