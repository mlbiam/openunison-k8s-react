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

function displayName(config, user) {
    for (var i = 0; i < user.attributes.length; i++) {
        if (user.attributes[i].name == config.displayNameAttribute) {
            return user.attributes[i].values[0];
        }
    }
}


export default function User(props) {
    

    return (
        <React.Fragment>
            <h2>{displayName(props.config, props.user)}'s Profile</h2>
            {/* contains two columns: attributes and groups*/}
            <Grid container
                direction="row"
            >

                {/* attributes */}
                <Grid item xs={12} sm={6} >
                    <h3>Attributes</h3>
                    <TableContainer >
                        <Table aria-label="user attributes">

                            <TableBody>
                                {Object.keys(props.userObj.attributes).map(function (attrName) {
                                    var attribute = props.userObj.attributes[attrName]
                                    return <TextField   id={attrName}
                                    label={props.config.attributes[attrName].displayName}
                                    disabled={true}
                                    fullWidth
                                    margin="normal"
                                    defaultValue={attribute} 
                                    
                                    sx={{
                                        "& fieldset": { border: 'none' },
                                      }}
                                    />
                                }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>





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
