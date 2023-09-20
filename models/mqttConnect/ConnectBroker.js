const mqtt = require("mqtt");
require("dotenv").config()
/*public: broker.hivemq.com
  private: c0494acde79b4c41af0c3c0d3e9fea4b.s2.eu.hivemq.cloud
  username: 'SistemaDeAutomação',
  password: '$2y$10$giInu2SnQapvwiQfItVZIuiQcqqW6NIUFu7ITjZo7i0TWNEijFFWy'
  protocol: 'mqtts'
*/

var options = {
    host: process.env.BROKER,
    port: process.env.PORT_BROKER    
}

var client = mqtt.connect(options);

async function Conectar(){
    try{
        client.on("connect", ()=>{
            console.log("Conectado ao Broker MQTT");
        });

        client.on('message', (topic, message)=>{
            console.log('Recebido mensagem no tópico: ' + topic.toString());
            console.log('Mensagem: ' + message.toString());
        });

        client.on('error', (error) => {
            console.error('Erro na conexão MQTT:', error);
        });

        client.on("reconnect", ()=>{
            console.log("Reconectado com sucesso!")
        });

    }  catch(error){
        console.log(error);
    };
};

async function SendToken(email, token){
    try{
        client.subscribe(email);
        client.publish(token);
    }catch(error){
        console.log("Erro", error);
    }
}

async function On(topic){
    try{
        client.subscribe(topic);
        client.publish(topic, "On");
    }catch(error){
        console.log(error);
    };
    
};
 
async function Off(topic){
    try{
        client.subscribe(topic);
        client.publish(topic, "Off");
    }catch(error){
        console.log(error);
    };
};

async function Edit(topic){
    try{
        client.subscribe(topic);
        client.publish(topic, "Edit");
    }catch(error){
        console.log(error);
    };
};

async function Remove(topic){
    try{
        client.subscribe(topic);
        client.publish(topic, "Delete");
    }catch(error){
        console.log(error);
    };
};

async function FecharConexao(){
    try{
        client.end(() =>{
            console.log("Cliente desconectado com sucesso!");  
        });
    }catch(error){
        console.log(error);
    };
};

exports.conectarBroker = Conectar;
exports.ligar = On;
exports.desligar = Off;
exports.editar = Edit;
exports.remover = Remove;
exports.sairMQTT = FecharConexao;
exports.EnviarToken = SendToken;