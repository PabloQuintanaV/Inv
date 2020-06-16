var  X=[new Date()];Y=[1];user=["u"];pointStylo=["rect"];texto=''; 

verde  = "#00FF00";
oliva  = "#007000";
burdeo = "#700000";
rojo   = "#FF0000";
gris   = "#BBBBBB";

/* Grafico 1 */
//var color = Chart.helpers.color;
var config = {
	type: 'line',
	data: {
		labels: X,
		datasets: [{
			//pointRadius : [10,10,10,10,10,10,10,10,10,10,10],
			pointHoverRadius:20,
			pointHitRadius : 25,
			//pointStyle: pointStylo,
			pointBackgrounColor: "rbga(0,191,255)",
			label: 'Encendido/Apagado',
			backgroundColor: "rgb(255, 99, 132)",
			borderColor: "rgb(255, 99, 132)",
			fill: true, //false,
			steppedLine: true,
			data: Y,
		}]
	},
	options: {
		responsive: true,
		title: { display: true, text: texto },
		tooltips: {
			mode: 'index',
			callbacks: {
			// Use callback to show in the tooltip
			    footer: function(tooltipItems, data) {
					tooltipItems.forEach(function(tooltipItem) {
						usuario=user[tooltipItem.index]; //sum+= data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
					});
					return 'Usuario: ' + usuario;
				},
			},
			footerFontStyle: 'normal'
		},
		scales:{
			xAxes: [{
					type: 'time',
					//time: {unit: 'day'},
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Fecha'
					},
					ticks: {
						major: {
							fontStyle: 'bold',
							fontColor: '#FF0000'
						}
					}
				}],
			yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Estado'
					},
					ticks:{max:1,min:0,stepSize:1 }
				}]
		}
	}
};
window.onload = function() {
	var ctx = document.getElementById('canvas').getContext('2d');
	window.grafico1 = new Chart(ctx, config);
}

function f(){ 
	var x=document.getElementById("myselect").value;
	grafico1.options.scales.xAxes[0].time.unit = x;
	window.grafico1.update();
}

function logout(){ location.replace('logout',);}

function s(path, params){
			const form = document.createElement('form');
			form.id ='idform';
			form.action = null ;
			//form.method  = 'post';
			//form.path = path;
			/*
			for(const key in params) {	
				if(params.hasOwnProperty(key)){ 
					const hiddenField = document.createElement('input');
					hiddenField.type = "hidden";
					hiddenField.name = key;
					hiddenField.value = params[key];
					form.appendChild(hiddenField);
				}
			}*/
			document.body.appendChild(form);
			button = document.createElement("input");
			button.setAttribute('id','idbutton');
			button.setAttribute('type','submit');
			form.appendChild(button);
			var mensaje ="T1";
			alert("algo");
			form.submit(function(e) {
				e.preventDefault(); // prevents page reloading
				socket.emit('message', mensaje);
				console.log("algo");
				return false;});
			alert("post");
} 

function onTx(id){
	console.log("enviando ON", id.substr(-2));
	socket.emit("tablero", {tablero: id.substr(-2), accion: 'ON'});	
}
function offTx(id){
	console.log("enviando OFF", id.substr(-2));
	socket.emit("tablero", {tablero: id.substr(-2), accion: 'OFF'});	
}
/* funcion cambia de tab */
function openTab(tabItem) {
  var i;
  var x = document.getElementsByClassName("tabcontent");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  document.getElementById(tabItem).style.display = "block";  
}

var socket = io.connect('/');//io();//.connect('http://localhost:80', { 'forceNew': true });

socket.on('redirect', function(data) {
    logout();
});

socket.on('grafico', function(data) {
	console.log("data:",data);
	var xx=[];
	for(var i=0;i<data.X.length;i++) xx.push(new Date(data.X[i]));
	
    grafico1.data.labels = xx;
    grafico1.data.datasets[0].data = data.Y;
    /*
    grafico1.options.tooltips.callbacks.footer =
					     function(tooltipItems, data) {
							var usuario = "";
							tooltipItems.forEach(function(tooltipItem) {
								usuario=data.user[tooltipItem.index];
							});
					      return 'Usuario: ' + usuario;
					    };*/
    pointStylo= new Array(X.length).fill("rect");
    //user.forEach((x,i)=>{ if(x=="local") pointStylo[i]="triangle";});
    //grafico1.data.datasets[0].pointStyle = pointStylo;
    grafico1.options.title.text ="Tablero: " + data.tablero;
    window.grafico1.update();
    console.log("data;",data);
});

socket.on('tablero', function(data) {
    console.log("data;",data);
    var a = "on"+data.tablero;
	var b = "off"+data.tablero;
    if(data.accion == "ON") {
		aa=document.getElementById(a);
		if (aa.className.indexOf("gray")>0)  aa.classList.remove("gray");
		if (aa.className.indexOf("oliva")>0) aa.classList.remove("oliva");
		aa.classList.add("verde");
		bb=document.getElementById(b);
		if (bb.className.indexOf("gray")>0) bb.classList.remove("gray");
		if (bb.className.indexOf("rojo")>0) bb.classList.remove("rojo");
		bb.classList.add("burdeo");
	}
	if(data.accion == "OFF") {
		aa=document.getElementById(a);
		if (aa.className.indexOf("gray")>0) aa.classList.remove("gray");
		if (aa.className.indexOf("verde")>0) aa.classList.remove("verde");
		aa.classList.add("oliva");
		bb=document.getElementById(b);
		if (bb.className.indexOf("gray")>0) bb.classList.remove("gray");
		if (bb.className.indexOf("burdeo")>0) bb.classList.remove("burdeo");
		bb.classList.add("rojo");
		//document.getElementById(b).style.backgroundColor = rojo;
		//document.getElementById(a).style.backgroundColor = oliva;
	}
});

