var config = require('../../config.js');
var pkg = require('../../package.json');
var chalk = require('chalk');

var consoleLog = config.consoleLog;

function green(msg){
	if(consoleLog){
		console.error(chalk.green(msg));
	}
}

module.exports = {

	ascii_art: function(){
		if(consoleLog){
			console.log('Community Discussion Forum Server '+pkg.version+'\n\n'+
				new Date() + '\n'
			);
		}
	},

	logReq: function(title, req){
		if(consoleLog){
			console.log(chalk.cyan('\n--- '+title+' : '+req.params.entity+' ---'));
			console.log('params = '+JSON.stringify(req.params, null, 2));
			console.log('query = '+JSON.stringify(req.query, null, 2));
			console.log('body = '+JSON.stringify(req.body, null, 2));
		}
	},

	logObject: function(title, obj){
		if(consoleLog){
			console.log(title+' = '+JSON.stringify(obj, null, 2));
		}
	},

	logSQL: function (sql){
		if(consoleLog){
			console.log('sql = '+sql+'\n');
		}
	},

	logCount: function(nbRecords){
		//green('Sending '+nbRecords+' records for '+reqid+'.');
		green('Sending '+nbRecords+' records.');
	},
	
	green: green,

	logSuccess: function(msg){
		green(msg);
	},

	logError: function(err){
		if(consoleLog){
			console.error(chalk.red(err));
		}
	},

	errorMsg: function(err, method){
		if(consoleLog){
			this.logError(err);
			return {
				error: err,
				method: method
			}
		}else{
			return {
				error: 'Error'
			}
		}
	},

};
