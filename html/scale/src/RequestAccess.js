import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orgs from './Orgs';
import Links from './Links';
import OrgInfo from './OrgInfo';
import { useEffect, useState } from 'react';
import AccessWorkflows from './AccessWorkflows';
import { TextField } from '@mui/material';
import configData from './config/config.json'

export default function RequestAccess(props) {
    const [workflows, setWorkflows] = React.useState({ wfs: [] })
    const [visibleWorkflows, setVisibleWorkflows] = React.useState({ wfs: [] })
    const [filter, setFilter] = React.useState("");
    const [currentOrg, setCurrentOrg] = React.useState({});

    function fetchWorkflows(node) {
        fetch(configData.SERVER_URL + "main/workflows/org/" + node)
            .then(response => {

                if (response.status == 200) {
                    return response.json();
                } else {
                    return Promise.resolve([]);
                }


            })
            .then(data => {
                var wfs = data;
                var newLinks = { "wfs": wfs };
                setWorkflows(newLinks);
                setVisibleWorkflows(newLinks);
                setFilter("");
            })
    }

    function handleRequestAccessOrgClick(event, node) {
        setCurrentOrg(props.orgsById[node]);
        fetchWorkflows(node);

    }

    function onWokrlfowChange(event) {

        filterWorkflows(event.target.value);
    }

    function filterWorkflows(filterValue) {
        setFilter(filterValue);


        var newVisibleWfs = { wfs: [] };
        workflows.wfs.map((wf) => {


            if (filterValue == '' || wf.label.includes(filterValue)) {
                newVisibleWfs.wfs.push(wf);
            }
        });

        setVisibleWorkflows(newVisibleWfs);
    }

    function updateCart(event, wf) {

        if (props.cart[wf.uuid]) {
            props.removeWorkflowFromCart(wf);
        } else {
            props.addWorkflowToCart(wf);
        }

        filterWorkflows(filter)
    }

    useEffect(() => {
        setCurrentOrg(props.orgs);
        fetchWorkflows(props.orgs.id);
    }, [props.orgs])



    return (
        <React.Fragment>
            <Grid container spacing={0}>
                {/* Chart */}

                <Grid item xs={12} md={7} lg={8}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240
                        }}
                    >
                        <Orgs orgs={props.orgs} config={props.config} flag={'showInRequest'} handleOrgClick={handleRequestAccessOrgClick} title={props.title} />
                    </Paper>
                </Grid>
                {/* Recent Deposits */}

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
                </Grid>
                <Grid item sm={12}>
                    <TextField label="Filter by label" fullWidth margin="normal" onChange={(event) => onWokrlfowChange(event)} value={filter} />
                </Grid>
                {/* Recent Orders */}
                <Grid item sm={12}>
                    <AccessWorkflows access={visibleWorkflows} updateCart={updateCart} cart={props.cart} />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}