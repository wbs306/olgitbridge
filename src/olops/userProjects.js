/*
| Gets all of the user's projects
*/
module.exports =
	async function( client, olServer )
{
	const res = await client.get( olServer + '/user/projects' );
	return res.data.projects;
};
