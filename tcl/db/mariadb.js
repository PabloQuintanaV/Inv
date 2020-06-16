let config = {
	host: "localhost",
	user: "dafiti",
	password: "fiti",
	database: "dafiti_tcl",
	connectionLimit: 5
};

let sql = {
	tablero : "SELECT * FROM acciones WHERE tablero=? ORDER BY fecha DESC LIMIT 1",
	// insertar nueva accion en db
	insertar: "INSERT INTO acciones(tablero,fecha,estado,desde,user) VALUES(?,?,?,?,?)",
	// para validar usuario
	usuarios: "SELECT * FROM usuarios WHERE usuario=? AND password=? AND estado='activo'",
	//grafico inicial
	grafico1: "SELECT * FROM acciones WHERE  tablero=? AND DATE(fecha)>= DATE_SUB(CURDATE(), INTERVAL 5 DAY)"
	
	}

module.exports = {config:config, sql:sql};
