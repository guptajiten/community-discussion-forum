var pg = require('pg'),
    config = config = require('../../config.js'),
    parseConnection = require('pg-connection-string').parse,
    csv = require('express-csv'),
    logger = require('./logger');

var dbConfig = parseConnection(config.connectionString)
dbConfig.max = 10; // max number of clients in the pool 
dbConfig.idleTimeoutMillis = 30000; // max client idle time before being closed

var pool = new pg.Pool(dbConfig);

pool.on('error', function (err, client) {
  console.error('Unexpected error on idle client', err.message, err.stack)
  process.exit(-1)
})

// - show error in console
function consoleError(err){
    if(err){
        logger.logError(err);
    }
}

// - concatenate SQL query
function sqlQuery(q){
    var sql = 'SELECT '+q.select+
        ' FROM '+q.from;
    if(q.where.length){
        sql += ' WHERE '+q.where.join(' AND ');
    }
    if(q.group) {sql += ' GROUP BY '+q.group;}
    if(q.order) {sql += ' ORDER BY '+q.order;}
    sql += ' LIMIT '+(q.limit || defaultPageSize);
    if(q.offset) {sql += ' OFFSET '+parseInt(q.offset, 10);}
    return sql;
}

// - run a query and return the result in request
function runQuery(res, sql, values, singleRecord, format, header, cbc=null){
    // Get a Postgres client from the connection pool 
    pool.connect(function(err, client, done) {
        // SQL Query > Select Data
        logger.logSQL(sql);
        client.query(sql, values, function(err, data) {
            done();
            var results = (data && data.rows) ? data.rows : [];
              if (err) {
                console.log(err.stack)
              } else {
                var nbRecords = results.length; 
                if(singleRecord){
                    logger.logCount(results.length || 0);
                    if(cbc !=null ){
                        cbc(results);
                    }
                    else
                        return res.json(results.length?results[0]:null);
                }else{
                    res.setHeader('_count', nbRecords);
                    if(nbRecords && results[0]._full_count){
                        res.setHeader('_full_count', results[0]._full_count);
                    }else{
                        res.setHeader('_full_count', 0);
                    }
                    logger.logCount(results.length || 0);
                    if(cbc !=null ){
                        cbc(results);
                    }
                    else
                        return res.json(results);
                }
            }
        })
    });

}

// --------------------------------------------------------------------------------------

module.exports = {

    runQuery: runQuery,
    sqlQuery: sqlQuery

}
