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
import { Badge } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import configData from './config/config.json'

export default function NavList(props) {

    const [logoutWarning, setLogoutWarning] = React.useState(false);
    
    function isHidden(pageName) {
        
        if (! props.config || ! props.config.hidePages ) {
            return false;
        }

        for (var i=0;i<props.config.hidePages.length;i++) {
            if (props.config.hidePages[i] == pageName) {
                return true;
            }
        }

        return false;
    }



    return (
        <React.Fragment>


            <Dialog
                open={logoutWarning}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Requests in Your Cart"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You still have open requests.  Do you want to continue to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {

                        window.location = props.config.logoutURL;
                    }}>Continue to Logout</Button>
                    <Button onClick={(event) => {
                        setLogoutWarning(false);
                    }} autoFocus>
                        Never Mind
                    </Button>
                </DialogActions>
            </Dialog>

            <List component="nav">

                <ListItemButton selected={props.pageName == 'user'}  aria-current="user"  onClick={(event) => {
                    props.chooseScreenHandler('user');


                }} >
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={props.userObj.attributes[props.config.displayNameAttribute]} />
                </ListItemButton>


                { isHidden('front-page') ? "" :
                
                <ListItemButton selected={props.pageName == 'front-page'} aria-current="front-page" onClick={(event) => {
                    props.chooseScreenHandler('front-page');

                }}
                
                
                >
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>

                }


                { isHidden('request-access') ? "" :
                
                props.config.enableApprovals ?
                    <ListItemButton selected={props.pageName == 'request-access'} aria-current="request-access" onClick={(event) => {
                        props.chooseScreenHandler('request-access');

                    }}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Request Access" />
                    </ListItemButton> : ""
                }

                {props.config.enableApprovals && Object.keys(props.cart).length > 0 ?


                    <ListItemButton selected={props.pageName == 'checkout'} aria-current="checkout" onClick={(event) => {
                        props.chooseScreenHandler('checkout');
                    }}>
                        <ListItemIcon>
                            <Badge badgeContent={Object.keys(props.cart).length} color="primary" >
                                <ShoppingCartIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Checkout" />
                    </ListItemButton>
                    : ""}

                {props.config.enableApprovals && props.approvals.open.length > 0 ?


                <ListItemButton selected={props.pageName == 'approvals'} aria-current="approvals" onClick={(event) => {
                    props.chooseScreenHandler('approvals');
                }}>
                    <ListItemIcon>
                        <Badge badgeContent={props.approvals.open.length} color="primary" >
                            <CheckCircleOutlineIcon />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Open Approvals" />
                </ListItemButton>
                : ""}


                {props.config.enableApprovals ? <ListItemButton selected={props.pageName == 'reports'} aria-current="reports" onClick={(event) => {
                    props.chooseScreenHandler('reports');
                }}>
                    <ListItemIcon>
                        <SummarizeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItemButton> : ""}

                { props.enableOps ? 
                
                <ListItemButton
                    selected={props.pageName == 'ops'}
                    aria-current="ops"
                    onClick={(event) => {
                        props.chooseScreenHandler('ops');

                    }}


                >
                    <ListItemIcon>
                        <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItemButton>
                
                
                : ""}
                <ListItemButton
                    selected={props.pageName == 'logout'}
                    aria-current="logout"
                    onClick={(event) => {
                        if (Object.keys(props.cart).length > 0) {
                            setLogoutWarning(true);
                        } else {
                            window.location = props.config.logoutURL;
                        }

                    }}


                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
                
            </List>
        </React.Fragment>
    );
}