let config = {
	host: "localhost",
	user: "dafiti",
	password: "fiti",
	database: "dafiti_tcl",
	connectionLimit: 5
};

let sql ={ usuarios:"SELECT * FROM usuarios WHERE user=? AND password=?"};
module.exports = {config:config, sql:sql};
