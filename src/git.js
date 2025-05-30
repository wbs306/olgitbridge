/*
| Handles the git calls.
*/
const aspawn = require( './aspawn' );

// git binary to call
const gitBinary = '/usr/bin/git';

/*
| Clones a repository from a file url.
|
| ~gitDir: directory of the bare repository.
| ~baseDir: parent dir to clone to.
*/
const clone =
	async function( gitDir, baseDir )
{
	await aspawn( gitBinary, [ 'clone', 'file://' + gitDir ], { cwd: baseDir } );
};

/*
| Creates a bare repository.
*/
const init =
	async function( dir )
{
	await aspawn( gitBinary, [ 'init', '--bare' ], { cwd: dir } );
};

/*
| Pulls a repository.
*/
const pull =
	async function( dir )
{
	await aspawn( gitBinary, [ 'pull', '--no-edit' ] , { cwd: dir } );
};

const createRepo =
	async function ( remote, dir )
{
	await aspawn( gitBinary, [ 'init', '-b', 'main' ], { cwd: dir } );
	await aspawn( gitBinary, [ 'remote', 'add', 'origin', remote ], { cwd: dir } );
	await aspawn( '/usr/bin/touch', [ 'README.md' ], { cwd: dir } );
	await aspawn( gitBinary, [ 'add', 'README.md' ], { cwd: dir } );
	await aspawn( gitBinary, [ 'commit', '-m', 'Inital commit' ], { cwd: dir });
	await aspawn( gitBinary, [ 'push', '-u', 'origin', 'main' ], { cwd: dir } );
}

/*
| Stages, commits and pushes.
|
| Currently all git errors are ignored, some need to like "nothing to commit",
| some might require better handling.
*/
const save =
	async function( count, dir, message )
{
	console.log( count, 'git staging all changes' );
	try { await aspawn( gitBinary, [ 'add', '--all' ], { cwd: dir }); }
	catch( e ) { console.log( e ); }

	console.log( count, 'git commit' );
	try { await aspawn( gitBinary, [ 'commit', '-m', message ], { cwd: dir }); }
	catch( e ) { console.log( e ); }

	console.log( count, 'git push' );
	try { await aspawn( gitBinary, [ 'push' ], { cwd: dir } ); }
	catch( e ) { console.log( e ); }
};

/*
| Exports.
*/
module.exports =
{
	clone: clone,
	init: init,
	pull: pull,
	save: save,
	createRepo: createRepo,
};
