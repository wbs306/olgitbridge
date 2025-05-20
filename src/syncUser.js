const axios = require('axios');
const fs = require('fs/promises');
const olops = require('./olops');
const config = require('../config');
const syncConfig = require('../config.sync');
const git = require('./git');

const olServer = config.olServer;
const port = config.port;
const blueDir = config.bluesDir;

const email = syncConfig.email;
const password = syncConfig.password;
const remote = syncConfig.remote;

const syncProject = async (projectId) => {
    let syncState;
    await axios.get(`http://localhost:${port}/sync-${projectId}`,
        {
            auth: {
                username: email,
                password: password
            }
        }
    ).then(response => {
        syncState = response.data;
    });
    return syncState;
}

const copyFilesToUserFolder = async (projectId, targetDir) => {
    const projectDir = targetDir + projectId;
    try {
        await fs.stat(projectDir);
    } catch (e) {
        if (e.code !== 'ENOENT') throw e;
        await fs.mkdir(projectDir);
    }

    await fs.cp(blueDir + projectId, projectDir, { recursive: true });
}

const main = async () => {
    const client = olops.client();

    await olops.login(client, olServer, email, password);
    const userId = await olops.getProjectPage(client, olServer, '');
    const userDir = syncConfig.userDir + userId + '/';

    try {
        await fs.stat(userDir);
    } catch (e) {
        if (e.code !== 'ENOENT') throw e;
        await fs.mkdir(userDir, { recursive: true });
        await git.createRepo(remote, userDir);
    }

    let haveSynced = false;
    try {
        const projects = await olops.userProjects(client, olServer);
        for (const project of projects) {
            const projectId = project._id;
            const syncState = await syncProject(projectId);
            if (syncState === 'SYNCED') {
                haveSynced = true;
                await copyFilesToUserFolder(projectId, userDir);
            }
        }
        if (haveSynced) await git.save('', userDir, 'Synced user projects');
    } catch (e) {
        throw e;
    }
}

main();
