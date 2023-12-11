    function update_new_project (eventObj) {
        fetch( eventObj.configData.SERVER_URL + 'target-metadata/' + eventObj.event.target.value)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.resolve({"isGit": false});
            }
        })
        .then(json => {
            eventObj.config.attributes["gitUrl"].show = json.isGit;
            eventObj.config.attributes["gitSshKey"].show = json.isGit;
            eventObj.setConfig(eventObj.config);
            eventObj.setUserData(eventObj.userData);
        });
    }
