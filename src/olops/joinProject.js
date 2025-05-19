/*
| Makes the real-time operations to join a project
*/
const axios = require('axios');

module.exports =
	async function (client, olApi, project_id, apiUsername, apiPassword, userId) {
		console.log(client.count, 'connect to', project_id);
		let project;
		await axios.post(`${olApi}/project/${project_id}/join`,
			{ userId: userId },
			{
				auth: {
					username: apiUsername,
					password: apiPassword
				},
				headers: {
					'Content-Type': 'application/json'
				}
			},
		).then(response => {
			project = response.data;
		}).catch(error => {
			console.error('Error:', error.response?.data || error.message);
		});
		return project.project;
	};
