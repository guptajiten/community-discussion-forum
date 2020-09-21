var express = require('express'),
	router = express.Router(),
	logger = require('./utils/logger'),
	config = require('../config'),
	apiPath = config.apiPath,
	crud = require('./crud'),
	stats = require('./stats'),
	charts = require('./charts');

logger.ascii_art();

// ======  GET STATS ====================================
router.get(apiPath+':entity/stats', stats.numbers);

// ======  CRUD ====================================
// -  GET MANY ------------------------------------
router.get(apiPath+':entity', crud.getMany);
// -  GET ONE   ------------------------------------
router.get(apiPath+':entity/:id', crud.getOne);
// -  INSERT ONE ------------------------------------
router.post(apiPath+':entity', crud.insertOne);
// -  UPDATE ONE  ------------------------------------
router.patch(apiPath+':entity/:id', crud.updateOne);
router.put(apiPath+':entity/:id', crud.updateOne);
// -  DELETE ONE ------------------------------------
router.delete(apiPath+':entity/:id', crud.deleteOne);
// -  LOV -----------------------------------------
router.get(apiPath+':entity/lov/:field', crud.lovOne);
// -  SUB-COLLECTIONS  ------------------------------------
router.get(apiPath+':entity/collec/:collec', crud.getCollec);
// -  INSERT ONE ------------------------------------
router.post(apiPath+':addcomment/:id', crud.addComment);

// ======  GET CHARTS ====================================
router.get(apiPath+':entity/chart/:field', charts.chartField);


module.exports = router;
