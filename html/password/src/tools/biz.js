import * as React from 'react';

export const loadAttributes = (userObj,user,config) => {
    userObj.currentGroups = []
    for (var i in user.attributes) {
        if (user.attributes[i].values.length > 0) {
            userObj.attributes[user.attributes[i].name] = user.attributes[i].values[0]
        }

        if (config.roleAttribute) {
            if (user.attributes[i].name === config.roleAttribute) {
                userObj.currentGroups = user.attributes[i].values;
                delete userObj.attributes[user.attributes[i].name];
            }
        }
    }

    if (! config.roleAttribute) {
        userObj.currentGroups = user.groups;
    }

    let localCurrentGroups = [...new Set(userObj.currentGroups)];
    userObj.currentGroups = localCurrentGroups.sort();
}