import * as React from 'react';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Title from './Title'
import { Typography } from '@mui/material';
import {useEffect, useState} from 'react';
import configData from './config/config.json'

export default function Orgs(props) {

  const [selectedNode,setSelectedNode] = React.useState("");

  function sortOrgsByName(orgs) {
    

    var sortedOrgs = orgs.sort(function (a,b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name == b.name) {
        return 0;
      } else {
        return 1;
      }
    })
    
    return sortedOrgs;
  }

  function buildTree(root,flag,first) {
    
    if (root[flag]) {
      var children = [];
      sortOrgsByName(root.subOrgs).map(function (subOrg){
        if (subOrg[flag]) {
          children.push(subOrg);
        }
      });


      return <TreeItem key={root.id} itemId={root.id}  label={root.name} expanded={first} data={root}>
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
        <SimpleTreeView
        aria-label="file system navigator"
        
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'visible' ,overflowX: 'hidden'}}
        defaultExpandedItems={[props.orgs.id]}
        selected={selectedNode}
        defaultSelectedItems={[props.orgs.id]}
        onItemClick={selectOrg}
        >

        {buildTree(props.orgs,props.flag)}

        
        
        </SimpleTreeView>
    </React.Fragment>
  );
}