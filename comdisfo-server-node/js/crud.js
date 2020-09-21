var dico = require('./utils/dico'),
    sqls = require('./utils/sql-select'),
    query = require('./utils/query'),
    logger = require('./utils/logger'),
    config = require('../config.js');

var schema = '"'+(config.schema || 'comdisfo_demo')+'"',
    defaultPageSize = config.pageSize || 50,
    lovSize = config.lovSize || 100;


// --------------------------------------------------------------------------------------
// -----------------    GET MANY   ------------------------------------------------------
// --------------------------------------------------------------------------------------

// - returns SQL for query returning a set of records
function sqlMany(m, req, allFields, wCount){
    var fs = allFields ? m.fields : m.fields.filter(dico.fieldInMany),
        sqlParams = [];
        if(allFields && fs.length===0){
            fs=allFields.slice(0, 5)
        }
    // ---- SELECTION
    var sqlSel = 't1.id, '+sqls.select(fs, false, true);
    dico.systemManyFields.forEach(function(f){
        sqlSel += ', t1.'+f.column
        if(f.type==='integer'){
            sqlSel += '::integer'
        }
    })
    var sqlFrom = m.schemaTable + ' AS t1' + sqls.sqlFromLOVs(fs, schema);

    // ---- FILTERING
    var sqlOperators = {
        'eq': '=',
        'ne': '<>',
        'gt': '>',
        'lt': '<',
        'gte': '>=',
        'lte': '<=',
        'ct': ' ILIKE ',
        'sw': ' ILIKE ',
        'fw': ' ILIKE ',
        'in': ' IN ',
        '0': '=',
        '1': '=',
        'null': ' IS ',
        'nn': ' IS '
    };

    var sqlWs = [];
    for (var n in req.query){
        if (req.query.hasOwnProperty(n)) {
            var f = (n==='id') ? {column:'id'} : m.fieldsH[n];
            if(f && ['select', 'filter', 'search', 'order', 'page', 'pageSize'].indexOf(f.column)<0){
                var cs = req.query[n].split('.');
                if(cs.length){
                    var cond=cs[0];
                    if(sqlOperators[cond]){
                        if((cond==='eq' || cond==='ne') && dico.fieldIsText(f)){
                            sqlParams.push(cs[1]);
                            if(f.type==='text' || f.type==='textmultiline' || f.type==='html'){
                                sqlWs.push('LOWER(t1."'+f.column+'")'+sqlOperators[cond]+'LOWER($'+sqlParams.length+')');
                            }else{
                                sqlWs.push('t1."'+f.column+'"'+sqlOperators[cond]+'$'+sqlParams.length);
                            }
                        }else{
                            var w='t1."'+f.column+'"'+sqlOperators[cond];
                            if(cond==='in' && (f.type==='lov' || f.type==='list')){
                                sqlWs.push(w+'('+cs[1].split(',').map(function(li){
                                    return "'"+li.replace(/'/g, "''")+"'";
                                }).join(',')+')'); 
                            }else if(cond==='0'){ // false
                                sqlWs.push('('+w+'false OR t1."'+f.column+'" IS NULL)');
                            }else if(cond==='1'){ // true
                                sqlWs.push(w+'true');
                            }else if(cond==='null'){ // empty        
                                sqlWs.push(' NOT '+w+'NULL');
                            }else{
                                if(cond==='nct'){ // not contains
                                    //TODO replace % in cs[1]
                                    sqlParams.push('%'+cs[1]+'%');
                                    sqlWs.push(' NOT '+w+'$'+sqlParams.length);
                                }else{
                                    if(cond==='sw'){ // start with
                                        sqlParams.push(cs[1]+'%');
                                    }else if(cond==='fw'){ // finishes with
                                        sqlParams.push('%'+cs[1]);
                                    }else if(cond==='ct'){ // contains
                                        sqlParams.push('%'+cs[1]+'%');
                                    }else{
                                        sqlParams.push(cs[1]);
                                    }
                                    sqlWs.push(w+'$'+sqlParams.length);
                                }
                            }
                        }
                    }else{
                        console.log('Invalid condition "'+cond+'"')
                    }
                }
            }
        }
    }

    // ---- SEARCHING
    if(req.query.search){
        // TODO: use fts
        var paramSearch = false,
            sqlWsSearch = [];

        if(m.searchFields && Array.isArray(m.searchFields)){
            logger.logObject('search fields', m.searchFields);
            var sqlP='"'+sqlOperators.ct+'$'+(sqlParams.length+1);
            m.searchFields.forEach(function(fid){
                sqlWsSearch.push('t1."'+m.fieldsH[fid].column+sqlP);
            });
            sqlParams.push('%'+req.query.search.replace(/%/g, '\%')+'%');
            sqlWs.push('('+sqlWsSearch.join(' OR ')+')');
        }
    }

    // ---- RECORD COUNT (added to selection)
    if(wCount){
        if(sqlWs.length){
            sqlSel += ',(SELECT count(*) FROM '+m.schemaTable+')::integer AS _full_count';
        }else{
            sqlSel += ',count(*) OVER()::integer AS _full_count';
        }
    }
    
    // ---- ORDERING
    sqlOrder='';
    var qOrder=req.query?req.query.order:null;
    if(qOrder){
        if(qOrder.indexOf(',')>-1){
            var qOs=qOrder.split(',');
            if(qOs){
                sqlOrder+=qOs.map(qOs, function(qo){
                    return sqls.sqlOrderFields(m, qo)
                }).join(',');
            }
        }else{
            sqlOrder+=sqls.sqlOrderFields(m, qOrder);
        }
    }else if(fs.length){
        sqlOrder = '2 ASC';
    }

    // ---- LIMITING & PAGINATION
    var offset=0,
        qPage=req.query.page||0, 
        qPageSize;

    qPageSize = parseInt(req.query.pageSize || defaultPageSize, 10);
    if(qPage){
        offset = qPage*qPageSize;
    }

    return {
        select: sqlSel,
        from: sqlFrom,
        where: sqlWs, // = array
        //group: '',
        order: sqlOrder,
        limit: qPageSize,
        offset: offset,
        params: sqlParams
    }
}

// - returns a set of records (filtered and sorted)
function getMany(req, res) {
    logger.logReq('GET MANY', req);
    var m = dico.getModel(req.params.entity);
    if(m){
        var format = req.query.format || null,
        sq = sqlMany(m, req, true, true),
        sql = query.sqlQuery(sq);

        query.runQuery(res, sql, sq.params, false, format, null);
    }
}

// --------------------------------------------------------------------------------------
// -----------------    GET ONE   -------------------------------------------------------
// --------------------------------------------------------------------------------------

// - get one record by ID
function getOne(req, res) {
    logger.logReq('GET ONE', req);

    var m = dico.getModel(req.params.entity),
        id = req.params.id;

    if(m && id){
        var sqlParams = [id],
            sql = 'SELECT t1.id, '+sqls.select(m.fields, m.collections, true)

            dico.systemFields.forEach(function(f){
                sql += ', t1.'+f.column
            })
            sql += ' FROM '+m.schemaTable+' AS t1'+sqls.sqlFromLOVs(m.fields, schema)+
                ' WHERE t1.id=$1'+
                ' LIMIT 1;';
            

                
        query.runQuery(res, sql, sqlParams, true, null, null, (res_1)=>{
            var m_com = dico.getModel('comments');
            var sqlParams_com = [id],
            sql_com = 'SELECT t1.id, '+sqls.select(m_com.fields, m_com.collections, true)

            sql_com += ', t1.c_date, t1.c_uid'
            // dico.systemFields.forEach(function(f){
            //     sql_com += ', t1.c_date'+f.column
            // })
            
            sql_com += ' FROM '+m_com.schemaTable+' AS t1'+
                ' WHERE t1.topic_id=$1;';
            query.runQuery(res, sql_com, sqlParams_com, true, null, null, (res_2)=>{
                 //MERGE BOTH QUERIES RESULS
                 //res_1 is LIMIT to one result
                 if(res_1 && res_1[0]){
                    res_1[0].comment = res_2;
                    res_1[0].commentcount = res_2.length;
                 }
                 return res.json(res_1.length?res_1[0]:null);
            });
        });      
    }else{
        return res.json(logger.errorMsg('Invalid entity \''+entity+'\'or field\''+fid+'\'.', 'getOne'));
    }
}


// --------------------------------------------------------------------------------------
// -----------------    INSERT ONE   ----------------------------------------------------
// --------------------------------------------------------------------------------------

// - insert a single record
function insertOne(req, res) {
    // TODO: validation
    logger.logReq('INSERT ONE', req);

    var m = dico.getModel(req.params.entity),
        q = sqls.namedValues(m, req, 'insert');

    if(m && q.names.length){
        var ps = q.names.map(function(n, idx){
            return '$'+(idx+1);
        });
        var sql = 'INSERT INTO '+m.schemaTable+
            ' ("'+q.names.join('","')+'") values('+ps.join(',')+')'+
            ' RETURNING id, '+sqls.select(m.fields, false, null, 'C')+';';

        query.runQuery(res, sql, q.values, true);
    }
}


// --------------------------------------------------------------------------------------
// -----------------    UPDATE ONE    ---------------------------------------------------
// --------------------------------------------------------------------------------------

// - update a single record
function updateOne(req, res) {
    // TODO: validation
    logger.logReq('UPDATE ONE', req);

    var m = dico.getModel(req.params.entity),
        id = req.params.id,
        q = sqls.namedValues(m, req, 'update');

    if(m && id && q.names.length){
        q.values.push(id);
        var sql = 'UPDATE '+m.schemaTable+' AS t1 SET '+ q.names.join(',') + 
            ' WHERE id=$'+q.values.length+
            ' RETURNING id, '+sqls.select(m.fields, false, null, 'U')+';';

        query.runQuery(res, sql, q.values, true);
    }
}


// --------------------------------------------------------------------------------------
// -----------------    DELETE ONE   ----------------------------------------------------
// --------------------------------------------------------------------------------------

// - delete a single record
function deleteOne(req, res) {
    logger.logReq('DELETE ONE', req);

    var m = dico.getModel(req.params.entity),
        id = req.params.id;

    if(m && id){
        // SQL Query > Delete Data
        var sql = 'DELETE FROM '+m.schemaTable+
                ' WHERE id=$1 RETURNING id::integer AS id;';
                
        query.runQuery(res, sql, [id], true);
    }else{
        res.json(logger.errorMsg('Missing parameters.', 'deleteOne'));
    }
}

// --------------------------------------------------------------------------------------
// -----------------    COMMENT ONE   ----------------------------------------------------
// --------------------------------------------------------------------------------------

// - add a single comment
function addComment(req, res) {
    logger.logReq('INSERT ONE COMMENT', req);

    var m = dico.getModel(/*req.params.entity*/'comments'),
        q = sqls.namedValuesForComments(m, req, 'insert');

    if(m && q.names.length){
        var ps = q.names.map(function(n, idx){
            return '$'+(idx+1);
        });
        var sql = 'INSERT INTO '+m.schemaTable+
            ' ("'+q.names.join('","')+'") values('+ps.join(',')+')'+
            ' RETURNING id, '+sqls.select(m.fields, false, null, 'C')+';';

        query.runQuery(res, sql, q.values, true);
    }
}


// --------------------------------------------------------------------------------------
// -----------------    LIST OF VALUES   ------------------------------------------------
// --------------------------------------------------------------------------------------

// - returns list of possible values for a field (usually for dropdown)
function lovOne(req, res) {
    logger.logReq('LOV ONE', req);

    var entity = req.params.entity,
        m = dico.getModel(entity),
        fid = req.params.field,
        f = m.fieldsH[fid];

    if(m){
        if(!f && fid===entity){
            // -- if field id = entity id, then use the entity itself as the lov
            f = {
                id: 'entity',
                lovcolumn: m.fields[0].column,
                lovtable: m.table
            }
        }
        if(f){
            var col = f.lovcolumn||'name',
                sql = 'SELECT id, "'+col+'" as text';
            if(f.lovicon){
                sql+=',icon'
            }
            sql+=' FROM '+schema+'."'+f.lovtable+
                '" ORDER BY UPPER("'+col+'") ASC LIMIT '+lovSize+';';
            query.runQuery(res, sql, null, false);
        }else{
            res.json(logger.errorMsg('Invalid field \''+fid+'\'.', 'lovOne'));
        }
    }else{
        res.json(logger.errorMsg('Invalid entity \''+entity+'\'.', 'lovOne'));
    }
}


// --------------------------------------------------------------------------------------
// -----------------    SUB-COLLECTIONS   -----------------------------------------------
// --------------------------------------------------------------------------------------

// - returns sub-collection (nested in UI but relational in DB)
function collecOne(req, res) {
    logger.logReq('GET ONE-COLLEC', req);

    var m = dico.getModel(req.params.entity),
        collecId = req.params.collec,
        collec = m.collecsH[collecId],
        pId = parseInt(req.query.id, 10);

    if(m && collec){
        var sqlParams = [pId];
        var sql = 'SELECT t1.id, '+sqls.select(collec.fields)+
                ' FROM '+schema+'."'+collec.table+'" AS t1'+//lovs.from+
                ' WHERE t1."'+collec.column+'"=$1'+
                ' ORDER BY t1.id'+//t1.position, t1.id
                ' LIMIT '+defaultPageSize+';';

        query.runQuery(res, sql, sqlParams, false);        
    }else{
        return res.json(logger.errorMsg('Invalid parameters.', 'collecOne'));
    }
}


// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

module.exports = {

    // - CRUD
    getMany: getMany,
    getOne: getOne,
    insertOne: insertOne,
    updateOne: updateOne,
    deleteOne: deleteOne,

    // - Sub-collections
    getCollec: collecOne,

    // - LOVs (for dropdowns)
    lovOne: lovOne,

    addComment: addComment

}
