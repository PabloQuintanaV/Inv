data =[ {e:0,t:8},{e:1,t:16}];
data =[ {e:0,t:4},{e:1,t:6},{e:0,t:12},{e:1,t:16},{e:0,t:18},{e:1,t:20}];

function f(){		
sumaOn=0; //sumaOff=0;

for(i=0;i<data.length;i++){
	if(i==0) { if(data[i].e == 0) sumaOn = data[i].t;
			   //else sumaOff = data[i].t;
			   }
	else{ if(i==data.length-1) { 
						if(data[i].e == 1) sumaOn += 24-data[i].t;
						//else               sumaOff  += 24-data[i].t;
						}
		if(data[i].e==0) sumaOn += data[i].t- data[i-1].t;
		//else  			 sumaOff += data[i].t- data[i-1].t; 
	}
}
console.log("sumaOn:",sumaOn,"sumaOff:",24-sumaOn);//sumaOff)
}

function f(){		
sumaOn=0; 
for(i=0;i<data.length;i++){
	if(i==0) { if(data[i].e == 0) sumaOn = data[i].t; }
	else{ if(i==data.length-1 && data[i].e == 1) sumaOn += 24-data[i].t;
		  if(data[i].e==0) sumaOn += data[i].t- data[i-1].t;
	}
}
console.log("sumaOn:",sumaOn,"sumaOff:",24-sumaOn);
}

select ColumnB, avg(ColumnA) from t group by ColumnB;
set @v="2020-05-24";
select fecha, horas from tt;
select rownumber ,if(rownumber=2,"dos","otro") from tt ;

// join es vetical entre tablas 
select t.columna, t.columnb from t inner join t as p on t.columna =p.columna;
//la union es entre es horizontal entre tablas con mismo n° de columnas
SELECT CustomerID, CustomerName FROM Customers
UNION
SELECT CustomerID, CustomerName FROM Customers;

SELECT date(fecha) FROM acciones GROUP BY date(fecha);
with a as (select *, 4*ColumnA AS r from t) select *,a.r*3 as e3 from a ;

with a as(select columna from t),b as(select columna from t)
select a.columna+  b.columna from a,b where a.columna=b.columna;

select first_value(columna) over (order by columna) from t limit 1;


with a as (select columnB as BB from t group by columnB)
select
 sum(t.columnA) 
 from t,a
 where t.columnB=a.BB;

with a as (select columnB as BB from t group by columnB)
select
 t.columnA +1 
 from t,a
 where t.columnB=a.BB;

with a as (select columna as A from t),
b as (select columnb as B from t)
select a.A, b.B from a,b;

SELECT * FROM t WHERE columnA IN (SELECT columnA FROM t );
								(select columnB from t group by columnB);
								
with a as (select columnB from t group by columnB) 
select 
     t.columnB,
     if(t.columnB='a', t.columnA + @suma, t.columnA) as suma,
     if(t.columnB='a', @suma:=t.columnA,0) as acum
     from t, (select @suma:=0) SQLVars;

     select 
     if(columnB='a', columnA + @suma, columnA) as suma,
     if(columnB='a',@suma:=columnA,0) as acum
     from t, (select @suma:=0) SQLVars;

WITH 
fe AS (SELECT date(fecha) AS dia FROM acciones GROUP BY dia)
SELECT fe.dia, @v:=fe.dia from fe, (SELECT @v:= 0) SQLVars;
 
 
SELECT date(fecha) AS fecha, time(fecha) AS horas,
  coalesce(lag(time(fecha)) over (order by fecha),0) from acciones
WHERE date(fecha) ="2020-05-24";
  
SELECT  coalesce(lag(columna) over (order by columna),0) FROM t; #//valor anterior de la fila = lag

FROM acciones a,fe, (SELECT @v:=0) SQLVars /* "2020-05-24") SQLVars*/
	WHERE date(a.fecha) = fe.dia /*@v*/

SELECT time(fecha) AS horas , @rownum:=@rownum+1 AS rownum,estado,@ultima,
IF(@rownum=9, 
IF(estado=0, /*and @rownum !=1 and @rownum!=@ultimo,*/
 unix_timestamp(fecha)-unix_timestamp(coalesce(lag(fecha) over (partition by estado order by fecha),0)),0), 88) 
AS cuentaOn
FROM acciones, 
(SELECT @rownum:=0, 
@ultima:=(SELECT COUNT(*) FROM acciones WHERE date(fecha)="2020-05-24") ) SQLVars
WHERE date(fecha) ="2020-05-24";

SELECT time(fecha) AS horas , @rownum:=@rownum+1 AS rownum,estado,
IF(@rownum=1, IF(estado=0,unix_timestamp(fecha)-unix_timestamp("2020-05-24") ,0),
          IF(@rownum=@ultima,IF(estado=0,
             24*3600-unix_timestamp(fecha)-unix_timestamp("2020-05-24"),unix_timestamp(fecha)-unix_timestamp(coalesce(lag(fecha) over (order by fecha),0))),
   IF(estado=0,unix_timestamp(fecha)-unix_timestamp(coalesce(lag(fecha) over (order by fecha),0)),0))) AS cuentaOn
FROM acciones, 
(SELECT @rownum:=0, 
@ultima:=(SELECT COUNT(*) FROM acciones WHERE date(fecha)="2020-05-24") ) SQLVars
WHERE date(fecha) ="2020-05-24";

/* ******** */
WITH 
fe AS (SELECT date(fecha) AS dia,count(*) AS cuenta FROM acciones GROUP BY dia)
SELECT date(a.fecha) AS fecha, time(a.fecha) AS horas,
	unix_timestamp(a.fecha)-unix_timestamp(fe.dia) AS segundos, 
	estado,
	if(date(a.fecha)=@f,if(@fila+1=fe.cuenta,"ultimo",@fila:=@fila+1),@fila:=1) as row,
	@f:=date(a.fecha) AS f
	FROM acciones a,fe, (SELECT @fila:=0,@f:=0) SQLVars
	WHERE date(a.fecha) = fe.dia


/*   **** Totalizador horas encendido apagado x día ********** */
WITH 
fe AS (SELECT date(fecha) AS dia,count(*) AS cuenta FROM acciones  WHERE tablero='T1' GROUP BY dia),
tt AS (
SELECT date(a.fecha) AS fecha, time(a.fecha) AS horas,
	unix_timestamp(a.fecha)-unix_timestamp(fe.dia) AS segundos, 
	estado,
	if(date(a.fecha)=@f,if(@fila+1=fe.cuenta,"ultimo",@fila:=@fila+1),@fila:=1) as rownumber,
	@f:=date(a.fecha) AS f
	FROM acciones a,fe, (SELECT @fila:=0,@f:=0) SQLVars
	WHERE date(a.fecha) = fe.dia
),
totalizado AS(
SELECT fecha,rownumber,
       FORMAT(segundos,0) AS segundos, 
       estado,
       IF(rownumber=1, IF(estado=0,segundos,0),
               IF(rownumber="ultimo",IF(estado=1,24*3600-segundos,segundos-@lastValue),
               IF(estado=0, segundos-@lastValue,0))) AS cuentaOn,
       FORMAT(@lastValue := segundos,0) AS lastValue
FROM tt, (SELECT @ultima:=(SELECT COUNT(*) FROM tt), @lastValue:=0) SQLVars2
)
SELECT 
 fecha, SUM(cuentaOn) AS segundosOn, 24*3600-SUM(cuentaOn) AS segundosOff,
 SEC_TO_TIME(SUM(cuentaOn)) AS Encendido,
 SEC_TO_TIME(24*3600-SUM(cuentaOn)) AS Apagado
FROM totalizado
GROUP BY fecha;


/**promedio semestral*/
WITH semestres as(
SELECT YEAR(fecha) AS año,FLOOR((MONTH(fecha)-1)/6)+1 AS semestre, valor FROM calendario)
SELECT año, semestre, AVG(valor) FROM semestres GROUP BY semestre, año ORDER BY año;
/**promedio semanal*/
select YEAR(fecha), WEEK(fecha), AVG(valor) FROM calendario GROUP BY WEEK(fecha), YEAR(fecha) ORDER BY fecha;
/**promedio mensual*/
SELECT YEAR(fecha), MONTH(fecha), AVG(valor) FROM calendario GROUP BY MONTH(fecha), YEAR(fecha) ORDER BY fecha;
/**promedio Trimestral*/
select YEAR(fecha), QUARTER(fecha), AVG(valor) FROM calendario GROUP BY QUARTER(fecha), YEAR(fecha) ORDER BY fecha;
/**promedio anual*/
select YEAR(fecha), AVG(valor) FROM calendario GROUP BY YEAR(fecha);

strore procedure que vaya poblando la tabla
y la vaya actualizando en la medida de nuevos valores

almacenar estos query en stored procedures que se puedan llamar con un call


/* Fin query *******************/

WITH 
fe AS (SELECT date(fecha) AS dia FROM acciones GROUP BY dia),
tt AS (
SELECT date(a.fecha) AS fecha, time(a.fecha) AS horas, 
	unix_timestamp(a.fecha)-unix_timestamp(@v) AS segundos, 
	ROW_NUMBER() OVER(ORDER BY a.fecha) rownumber ,estado, @v:=fe.dia
	FROM acciones a,fe, (SELECT @v:=0) SQLVars /* "2020-05-24") SQLVars*/
	WHERE date(a.fecha) = fe.dia /*@v*/
)
,totalizado AS (
SELECT rownumber,
       FORMAT(segundos,0) AS segundos, 
       estado,
       IF(rownumber=1, IF(estado=0,segundos,0),
               IF(rownumber=@ultima,IF(estado=1,24*3600-segundos,segundos-@lastValue),
               IF(estado=0, segundos-@lastValue,0))) AS cuentaOn,
       FORMAT(@lastValue := segundos,0) AS lastValue
FROM tt, (SELECT @ultima:=(SELECT COUNT(*) FROM tt), @lastValue:=0) SQLVars2
)
SELECT 
 @v AS Fecha,
 SEC_TO_TIME(SUM(cuentaOn)) AS Encendido,
 SEC_TO_TIME(24*3600-SUM(cuentaOn)) AS Apagado
FROM totalizado
GROUP BY dia;


SELECT date(fecha) AS dia FROM acciones GROUP BY dia;

FORMAT(IF(@lastSN=EL.SN,EL.Value-@lastValue,0000.00),2) AS Consumption,
      @lastSN:=EL.SN AS lastSN,
      FORMAT(@lastValue:=EL.Value,2) AS lastValue
      

IF(rownumber=MAX(rownumber) AND estado=1, @sumaOn+24-segundos, 

SELECT rownumber,segundos, estado,  IF(1=1,@sumaOn =34,0), 
            @lastaValue := segundos
FROM tt, (SELECT @sumaOn:=0, @lastValue:=0) SQLVars2; 

select ColumnA as a, if(Columna=1,@v1:=1,
     if(Columna=2,@v2:=2,3)) as ssiiii
from t,(select @v1:=0,@v2:=0) sqlvar;


SELECT rownumber,segundos, estado,IF(rownumber=1 AND estado=0,  @sumaOn=segundos,
             IF(rownumber=MAX(rownumber) AND estado=1, @sumaOn+24-segundos, 
                 IF(estado=0, @sumaOn=@sumaOn+segundos-@lastValue,0))) AS si,
         @lastValue := segundos 
FROM tt, (SELECT @sumaOn:=0, @lastValue:=0) SQLVars2; 


SELECT rownumber, IF(rownumber=1 AND estado=0,segundos,
					IF(rownumber=MAX(rownumber) AND estado=1,
					   24-segundos,
					     IF(estado=0,segundos-@lastValue,0))) AS si,
	  	  @lastValue := segundos
FROM tt, (SELECT @sumaOn:=0, @lastValue:=0) SQLVars;

	
	
SELECT CASE 1 WHEN rownumber = 1 AND estado = 0 THEN @sumaOn = segundos
			  WHEN rownumber = MAX(rownumber) AND estado = 1 THEN @sumaOn = 24- segundos +@sumaOn
			  ELIF estado = 0 THEN @sumaOn = segundos - lastValue+ @sumaOn
			  END AS sumaON,
			  @lastValue := segundos
FROM tt, (SELECT @sumaOn:=0, @sumaOFF:=0) SQLVars2;







WITH cte AS
(SELECT *,ROW_NUMBER() OVER(ORDER BY ColumnA) row from t) 
SELECT ColumnA, Max(row) from cte;

SELECT IF(21>2 and 34>22,IF(3>4,22,33),3) as test;

SELECT date(fecha) AS dia FROM acciones GROUP BY dia;
| dia        |
+------------+
| 2020-05-17 |
| 2020-05-19 |
| 2020-05-23 |
| 2020-05-24 |
| 2020-05-25 |
| 2020-05-28 |
+------------+

SELECT  date(fecha) as fecha, time(fecha) AS horas, estado  FROM acciones WHERE date(fecha) = "2020-05-24";

set @v="2020-05-24";
SELECT date(fecha) AS fecha, time(fecha) AS horas, 
	unix_timestamp(fecha)-unix_timestamp(@v) AS segundos, 
	ROW_NUMBER() OVER(ORDER BY fecha) row ,estado
	FROM acciones WHERE date(fecha) = @v;

SELECT ColumnA,  IF(ColumnB ='a', @bn:=@bn+ColumnA, @bn:=@bn) as phaseblock,ColumnB 
FROM t, (SELECT @bn:=0, @P:=0) block;
GROUP BY phaseblock;

SELECT CASE WHEN @a=1 THEN 'one' WHEN @a=2 THEN 'two' ELSE 'more' END;

SELECT ColumnA, CASE 1 WHEN ColumnA >2 THEN ColumnA + @bk ELSE 'more' END 
FROM t, (SELECT @bk:=10) block;

set @v=date(now());
SELECT id, SUM(consumption) FROM consumption_info WHERE date_time BETWEEN "2013-09-15" AND "2013-09-16" 
GROUP BY id;
select sum(if(ModeOfPayment = 'Online',Amount,0)) as TotalAmount from SumWithIfCondition;
SUM(CASE WHEN .. THEN .. ELSE .. END) ==  SUM(IF(.., .., ..)) 
SELECT OrderId, 
       COUNT(*) ItemCount,
       SUM(CASE WHEN PriceType = 'CopyCost' THEN Price ELSE 0 END) TotalCopyCost,
       SUM(CASE WHEN PriceType = 'FullPrice' THEN Price ELSE 0 END) TotalFullPrice
	   FROM OrderDetails
	   GROUP BY OrderId


IF search_condition THEN statement_list
    [ELSEIF search_condition THEN statement_list] ...
    [ELSE statement_list]
END IF;

SELECT max(c1), c2 from t where c2 >2 group by c1;
	   
SELECT  SUM(CASE WHEN MOD(ColumnA,2) = 1 THEN Price ELSE 0 END) TotalCopyCost from T;

select f.ColumnA, ColumnB from t f;

SELECT s.phaseblock, max(s.dt), sum(s.readings) sumreadings FROM
(SELECT T.*, IF(T.phase =1, @bn:=@bn+1, @bn:=@bn) as phaseblock,
            @p:=T.phase AS p
 FROM T, (SELECT @bn:=0, @P:=0) block
 ORDER BY T.id
) s
GROUP BY s.phaseblock;

	   
SELECT 
    SUM(CASE
        WHEN status = 'Shipped' THEN quantityOrdered
    END) qty_shipped,
    SUM(CASE
        WHEN status = 'Disputed' THEN quantityOrdered
    END) qty_on_disputed,
    SUM(CASE
        WHEN status = 'In Process' THEN quantityOrdered
    END) qty_in_process
FROM
    orderdetails
        INNER JOIN
    orders USING (orderNumber);

create table t (ColumnA INT, ColumnB VARCHAR(50));
insert into t values
    -> (2,           'a'),
    -> (3  ,         'b'),
    -> (4   ,        'c'),
    -> (5    ,       'd'),
    -> (1     ,      'a');


DECLARE @t TABLE(ColumnA INT, ColumnB VARCHAR(50));
INSERT INTO @t VALUES
(2,           'a'),
(3  ,         'b'),
(4   ,        'c'),
(5    ,       'd'),
(1     ,      'a');
 
WITH cte AS
(  SELECT ColumnB, SUM(ColumnA) asum
   FROM t 
   gROUP BY ColumnB
), cteRanked AS
(
   SELECT asum, ColumnB, ROW_NUMBER() OVER(ORDER BY ColumnB) rownum
   FROM cte
) 
SELECT (SELECT SUM(asum) FROM cteRanked c2 WHERE c2.rownum <= c1.rownum) AS ColumnA, ColumnB
FROM cteRanked c1;


SELECT  SUM( 
 IF ColumnA > 3 THEN  SET level ='low' ELSE SET level = 'High'

   IF value < 500 THEN
      SET level = 'Low';

   ELSEIF value >= 500 AND value <= 4000 THEN
      SET level = 'Medium';

   ELSE
      SET level = 'High';

   END IF;

   RETURN level;


create table calendario( fecha datetime, valor int);

insert into calendario values
("2020-01-10",1),
("2020-01-11",2),
("2020-02-12",2),
("2020-02-13",3),
("2020-03-14",3),
("2020-03-15",4),
("2020-04-16",4),
("2020-04-17",5),
("2020-05-18",5),
("2020-05-19",6),
("2020-06-20",6),
("2020-06-21",7),
("2020-07-22",7),
("2020-07-23",8),
("2020-08-24",8),
("2020-08-25",9),
("2020-09-26",9),
("2020-09-27",10),
("2020-10-28",10),
("2020-10-29",11),
("2020-11-03",11),
("2020-11-04",12),
("2020-12-02",12),
("2020-12-03",13),
("2021-01-10",13),
("2021-01-11",14),
("2021-02-12",14),
("2021-02-13",15),
("2021-03-14",15),
("2021-03-15",16),
("2021-04-16",16),
("2021-04-17",17),
("2021-05-18",17),
("2021-05-19",18),
("2021-06-20",18),
("2021-06-21",19),
("2021-07-22",19),
("2021-07-23",20),
("2021-08-24",20),
("2021-08-25",21),
("2021-09-26",21),
("2021-09-27",22),
("2021-10-28",22),
("2021-10-29",23),
("2021-11-03",23),
("2021-11-04",24),
("2021-12-02",24),
("2021-12-03",25);


create table EnergyLog(SN int, Date datetime,Value float, consumption float);
SN      Date                 Value  consumption
insert into EnergyLog values
(2380   , '2012-10-30 00:15:51',  21.01,  0),
(2380   , '2012-10-31 00:31:03',  22.04,  1.03),
(2380   , '2012-11-01 00:16:02',  22.65,  0.61),
(2380   , '2012-11-02 00:15:32',  23.11,  0.46),
(20100  , '2012-10-30 00:15:38',  35.21,  0),
(20100  , '2012-10-31 00:15:48',  37.07,  1.86),
(20100  , '2012-11-01 00:15:49',  38.17,  1.1),
(20100  , '2012-11-02 00:15:19',  38.97,  0.8),
(20103  , '2012-10-30 10:27:34',  57.98,  0),
(20103  , '2012-10-31 12:24:42',  60.83,  2.85);


SELECT
      EL.SN,
      EL.Date,
      EL.Value,
      FORMAT(IF(@lastSN=EL.SN,EL.Value-@lastValue,0000.00),2) AS Consumption,
      @lastSN:=EL.SN AS lastSN,
      FORMAT(@lastValue:=EL.Value,2) AS lastValue
FROM  EnergyLog EL, (SELECT @lastSN:=0, @lastValue:=0) SQLVars
ORDER BY EL.SN, EL.Date;
      
 
This should do the trick:

SELECT l.sn,
       l.date, 
       l.value,
       l.value - (SELECT value 
                  FROM energylog x
                  WHERE x.date < l.date
                  AND x.sn = l.sn
                  ORDER BY date DESC
                  LIMIT 1) consumption
FROM energylog l;

/** Queries */
//start mariadb
sudo mysql -u root
//change db
use dafiti_tcl;
show tables;
show warnings
//table usuarios
drop table usuarios;

create table usuarios ( 
   usuario_id INT(6) NOT NULL AUTO_INCREMENT,
   nombre VARCHAR(30) NOT NULL, 
   apellido VARCHAR(30) NOT NULL, 
   usuario VARCHAR(30) NOT NULL, 
   password VARCHAR(30) NOT NULL, 
   email VARCHAR(50) NOT NULL, 
   tipo VARCHAR(20) NOT NULL,
   estado VARCHAR(20) NOT NULL,
   fecha_creacion DATETIME NOT NULL,
   fecha_modificacion DATETIME,
   PRIMARY KEY (usuario_id) ); 

insert into usuarios (nombre,apellido,usuario,password,email,tipo,estado,fecha_creacion) values
("administrador","administrador","admin","admin","admin email","administrador","activo",NOW()),
("visita","visita","visita","visita","visita email","usuario","activo",NOW()),
("prueba","prueba","prueba","prueba","prueba email","usuario","inactivo",NOW());
//table acciones
drop table acciones;

create table acciones ( 
   accion_id INT(10) NOT NULL AUTO_INCREMENT,
   tablero VARCHAR(30) NOT NULL, 
   fecha DATE NOT NULL,
   estado BOOLEAN NOT NULL,
   desde VARCHAR(20) NOT NULL, 
   usuario VARCHAR(30) NOT NULL, 
   PRIMARY KEY (accion_id) ); 

insert into acciones (tablero,fecha,estado,desde,usuario) values
();
//schedule tasks
//mostar eventos: SHOW EVENTS
//para borrar evento:  DROP EVENT myevent;
//previo on each restart:  SET GLOBAL event_scheduler=ON
CREATE OR REPLACE EVENT myevent
 ON SCHEDULE EVERY 30 SECOND
 DO UPDATE t SET columna = columna +1 WHERE columnB='b';

//stored procedures
//mostrar procedures: SHOW PROCEDURE STATUS;
//borrar DROP PROCEDURE  mypro;
//crear
DELIMITER //
CREATE PROCEDURE mypro()
  BEGIN
  SELECT * FROM t;
  END;
//
DELIMITER ;

//llamar: CALL mypro();

// Insertar desde query
insert  into t (ColumnA,ColumnB) (select  user_id, usuario from usuarios);

// Query tiempo 3 dias atrás
select * from acciones where  tablero="T1" AND date(fecha)>= date_sub(curdate(), interval 3 day);


  RowDataPacket {
    tablero: 'T1',
    fecha: 2020-06-07T03:52:28.000Z,
    estado: 0,
    desde: 'remoto',
    user: 'admin'
  },

X Y datousuario Tablero

{tablero:T1,X:x,Y:y,user:user}
x=[];y=[];user=[];
for(var i=0; i<sqlRespuesta.length; i++){
x.push(sqlRespuesta[i].fecha);  
y.push(sqlRespuesta[i].estado);
user.push(sqlRespuesta[i].user);}
socket.emit("grafico",  {tablero:T1,X:x,Y:y,user:user})
  
}
