''' Mosquitto desde consola pi@raspi:
En raspi se inicia como un servicio
la configuracion esta en mosquitto.conf /etc/mosquitto/
Published:
mosquitto_pub -h 192.168.43.15 -t "casa/cocina" -m "hek\n df" -q 1 #qos[0,1,2]
Subscriber:
mosquitto_sub -d -h 192.168.43.15 -t "QW"
'''
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags,rc):
	print("connected to (%s)" % client._client_id)
	client.subscribe(topic="casa/cocina", qos=2)

def on_message(client, userdata, message):
	print("-"*20)
	print("topic: %s" % message.topic)
	print("payload: %s" % message.payload)
	print("qos: %s" % message.qos)


#el client_id lo puede definir el server auto o el cliente
def main():
	client = mqtt.Client(client_id="gatuns",clean_session=False)
	client.on_connect = on_connect #fx
	client.on_message = on_message #fx
	client.connect(host="127.0.0.1", port=1883)
	client.loop_forever()
	
main()
