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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function RequestAccess(props) {
    const [workflows, setWorkflows] = React.useState({ wfs: [] })
    const [visibleWorkflows, setVisibleWorkflows] = React.useState({ wfs: [] })
    const [filter, setFilter] = React.useState("");
    const [currentOrg, setCurrentOrg] = React.useState({});
    const [annotationFilters,setAnnotationFilters] = React.useState({});
    const [selectedFilters,setSelectedFilters] = React.useState({});

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

                var wfAnnotations = {};

                wfs.map(wf => {
                    Object.keys(wf.filterAnnotations).map(annotationLabel => {
                        var vals = wfAnnotations[annotationLabel];
                        if (vals) {
                            if (! vals.includes(wf.filterAnnotations[annotationLabel])) {
                                vals.push(wf.filterAnnotations[annotationLabel]);
                                vals.sort();
                            }
                        } else {
                            vals = ["",wf.filterAnnotations[annotationLabel]];
                            wfAnnotations[annotationLabel] = vals;
                        }
                    })
                });

                setAnnotationFilters(wfAnnotations);
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

        filterWorkflows(event.target.value,selectedFilters);
    }

    function filterWorkflows(filterValue,filterAnnotations) {
        setFilter(filterValue);


        var newVisibleWfs = { wfs: [] };
        workflows.wfs.map((wf) => {


            if (filterValue == '' || wf.label.includes(filterValue)) {
                var matchFilters = true;

                Object.keys(filterAnnotations).map(annotationLabel => {
                    if (filterAnnotations[annotationLabel] != '') {
                        matchFilters = matchFilters && (wf.filterAnnotations[annotationLabel] == filterAnnotations[annotationLabel]);
                    }
                });

                if (matchFilters) {
                    newVisibleWfs.wfs.push(wf);
                }
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

        filterWorkflows(filter,selectedFilters)
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
                {
                                Object.keys(annotationFilters).map(annotationLabel => {
                                    return  <Grid item sm={12} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="label-annotation-{annotationLabel}">{annotationLabel}</InputLabel>
                                                    <Select
                                                        labelId="label-annotation-{annotationLabel}"
                                                        id="select-annotation-{annotationLabel}"

                                                        label={annotationLabel}
                                                        onChange={event =>{
                                                            var lselectedfilters = {...selectedFilters};
                                                            lselectedfilters[annotationLabel] = event.target.value;
                                                            setSelectedFilters(lselectedfilters);
                                                            filterWorkflows(filter,lselectedfilters);
                                                        }}
                                                    >
                                                        {

                                                            annotationFilters[annotationLabel].map(function (label) {

                                                                return <MenuItem value={label}>{label}</MenuItem>
                                                            })
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                })
                            }
                {/* Recent Orders */}
                <Grid item sm={12}>
                    <AccessWorkflows access={visibleWorkflows} updateCart={updateCart} cart={props.cart} />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}