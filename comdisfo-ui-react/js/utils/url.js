module.exports = {

	querySearch(query){
		// - make uri params string from query object
		// - example: {a:'aaa', b: 'bbb'} => "a=aaa&b=bbb"
		var url = ''
		for(var prop in query) {
			url += prop+'='+encodeURI(query[prop]||'')+'&'
		}
		return url.slice(0, -1);
	}

}
