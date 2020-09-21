
module.exports = {
	apiPath: '/api/v1/comdisfo/',
	apiPort: 3000,
	apiHost: '127.0.0.1',
	connectionString: process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/comdisfo_test',
	schema: 'comdisfo_demo',
	// - Timestamp columns u_date and c_date w/ date of record creation and last update 
	wTimestamp: true,
	// - "WhoIs" columns u_uid and c_uid w/ userid of creator and last modifier
	wWhoIs: true,
	wComments: true,
	wVoting: true,
	consoleLog: true,
};
