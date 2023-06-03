import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Title from './Title'
import { Typography } from '@mui/material';
import {useEffect, useState} from 'react';

export default function Orgs(props) {

  const [selectedNode,setSelectedNode] = React.useState("");

  

  function buildTree(root,flag,first) {
    
    if (root[flag]) {
      var children = [];
      root.subOrgs.map(function (subOrg){
        if (subOrg[flag]) {
          children.push(subOrg);
        }
      });


      return <TreeItem key={root.id} nodeId={root.id} label={root.name} expanded={first} data={root}>
              {children.map(function (subOrg){return buildTree(subOrg,flag) })}
             </TreeItem>
    } else {
      return "";
    }
  }

  useEffect(() => {
    setSelectedNode(props.orgs.id);
  }, [])

  function selectOrg(event,node) {
    setSelectedNode(node);  
    props.handleOrgClick(event,node);
  }



  return (
    <React.Fragment>
        <Title>{props.title}</Title>
        <Typography>{props.config.frontPage.text}</Typography>
        <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        defaultExpanded={[props.orgs.id]}
        selected={selectedNode}
        defaultSelected={props.orgs.id}
        onNodeSelect={selectOrg}
        >

        {buildTree(props.orgs,props.flag)}

        
        
        </TreeView>
    </React.Fragment>
  );
}