/* Cliente mqtt probado contra servidor mosquitto publica y subscribe
 * interactua con consola de clientes mosquitto
 * mosquitto_sub -t test
 * mosquitto_pub -t test -m {t1:"off"}
 * */
var mqtt    = require('mqtt');
var simId = "0000";
var clientMqtt  = mqtt.connect("mqtt://localhost:1883",
    {   clientId: simId,
        keepalive: 1,
        clean: false,
        // Do not set to a value > 29 until this bug is fixed : https://github.com/mqttjs/MQTT.js/issues/346
        reconnectPeriod: 1000 * 1
    }
);


clientMqtt.on('connect', function(){
    clientMqtt.subscribe('tableros/#', { qos: 1 });
    console.log('connected to the server. ID :', simId);
});

clientMqtt.on('message', function(topic, message) {
    // topic=tableros/T1/set message={"accion":"on","user":"local"} tableros/T1/set {"accion":"on","user":"local"} 
    topico = topic.toString().split("/");
    m = JSON.parse(message);
    //console.log("m.accion",m["accion"]);
    m["accion"].toUpperCase()=="ON"?console.log("es on"):console.log("es off"); 
   
    if(topico[2] == "status") console.log("message de estado:",topico[1],m, "avisar a clientes web");
    if(topico[2] == "set") console.log("message de set:",topico[1],m,"no hacer nada");
});

clientMqtt.on("error", function(error) {
    console.log("ERROR: ", error);
});

clientMqtt.on('offline', function() {
    console.log("offline");
});

clientMqtt.on('reconnect', function() {
    console.log("reconnect");
});
data = { tablero: 'T1', accion: 'OFF' };

setTimeout(function(){
    b = "T1";
    a="YftRRRRttYY"
    //console.log("tableros",JSON.stringify({"accion":"ON","user":"username"}));
    clientMqtt.publish("tableros/"+ b +"/set", JSON.stringify({"accion":"ON","user":a}),
                  {qos: 1}, function(){console.log("message ON sent ")});
}, 3000)


/* {"accion":"ON","user":"username"}

setTimeout(function(){
   clientMqtt.subscribe('test', { qos: 1 }); 
}, 3000)

//start sending
var i = 0;
a=setInterval(
    function(){
        var message = i.toString();
        console.log("sending ", message)
        clientMqtt.publish("test", message, {qos: 1}, function(){
            console.log("sent ", message)
        });
        i++;
        if(i == 10) clearInterval(a);
    },
2000);

*/
