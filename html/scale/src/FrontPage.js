import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orgs from './Orgs';
import Links from './Links';
import OrgInfo from './OrgInfo';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import configData from './config/config.json'

export default function FrontPage(props) {
    const [links, setLinks] = React.useState({ "urls": [] })
    const [currentOrg, setCurrentOrg] = React.useState({});

    function fetchLinks(node) {
        setLinks({"urls":props.orgsById[node].links});
        /*
        fetch(configData.SERVER_URL + "main/urls/org/" + node)
            .then(response => {

                if (response.status == 200) {
                    return response.json();
                } else {
                    return Promise.resolve([]);
                }


            })
            .then(data => {
                var urls = data;
                var newLinks = { "urls": urls };
                setLinks(newLinks);
            })*/
    }

    function handlePortalOrgClick(event, node) {

        setCurrentOrg(props.orgsById[node]);
        fetchLinks(node);
        

    }

    useEffect(() => {
        //if (! props.config.showPortalOrgs) {
        setLinks(props.links);
        fetchLinks(props.orgs.id);
        //}
    }, [props.links])

    useEffect(() => {
        setCurrentOrg(props.orgs);
    }, [props.orgs])


    return (
        <React.Fragment>
            <Grid container spacing={0}>
                {/* Chart */}
                {props.config.showPortalOrgs ?
                    <Grid item xs={12} md={7} lg={8}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240
                            }}
                        >
                            <Orgs orgs={props.orgs} config={props.config} flag={'showInPortal'} handleOrgClick={handlePortalOrgClick} title={props.title} />
                        </Paper>
                    </Grid> : ""}
                {/* Recent Deposits */}
                {props.config.showPortalOrgs ?
                    <Grid item xs={12} md={5} lg={4} >
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240
                            }}
                        >
                            <OrgInfo org={currentOrg} />
                        </Paper>
                    </Grid> : ""}
                {/* Recent Orders */}
                <Grid item sm={12}>
                    { links.urls.length > 0 ? <Links links={links} /> : 
                    
                    <Alert severity="info">
                        <h1>There are no links available, you may need to request access for an application to gain access.</h1>
                    </Alert>
                    }
                    
                </Grid>
            </Grid>
        </React.Fragment>
    );
}