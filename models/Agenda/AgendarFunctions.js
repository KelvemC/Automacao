require("../collections/AgendamentosDispositivo");
require("../collections/AgendamentosGrupo");
require("../collections/Dispositivo");
require("../collections/Grupo");
require("dotenv").config();

const mongoose = require("mongoose");
const AgendarDispositivos = mongoose.model("AgendamentoDispositivo")
const AgendarGrupos = mongoose.model("AgendamentoGrupos");
const Dispositivo = mongoose.model("Dispositivos");
const Grupo = mongoose.model("Grupos");
const controle = require("../ControlUser/Controls");
const cron = require("node-cron");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
OAuth2_client.setCredentials({refresh_token: process.env.REFRESH_TOKEN_CALENDAR});

async function on_dispositivo(id,nome,user){
    try{
        await controle.MQTT.ligar(nome);
        Dispositivo.findOneAndUpdate({_id:id, usuario:user}, {on_off:true}, {new:true}).catch((error)=>{
            console.log("erro ao atualizar status", error);
        });
    }catch (error){
        throw new Error(`erro ao ligar dispositivo${nome}`, error);
    };
};

async function off_dispositivo(id,nome,user){
    try{
        await controle.MQTT.desligar(nome);
        Dispositivo.findOneAndUpdate({_id:id, usuario:user}, {on_off:false}, {new:true}).catch((error)=>{
            console.log("erro ao atualizar status", error);
        });
    }catch(error){
        throw new Error(`erro ao desligar dispositivo${nome}`, error);
    }
    
};

async function on_grupo(id,array, user){
    try{
        array.forEach(async element => {
            await controle.MQTT.ligar(element);
            Dispositivo.findOneAndUpdate({nome:element, usuario:user}, {on_off:true}, {new:true}).catch((error)=>{
                console.log("erro ao atualizar status dos dispositivos", error);
            });
        });    
        Grupo.findOneAndUpdate({_id:id, usuario:user}, {on_off:true}, {new:true}).catch((error)=>{
            console.log("erro ao atualizar status do grupo", error);
        });
    }catch(error){
        throw new Error(`Erro ao ligar grupo`, error);
    };
};

async function off_grupo(id, array, user){
    try{
        array.forEach(async element => {
            await controle.MQTT.desligar(element);
            Dispositivo.findOneAndUpdate({nome:element, usuario:user}, {on_off:false}, {new:true}).catch((error)=>{
                console.log("erro ao atualizar status dos dispositivos", error);
            });
        });    
        Grupo.findOneAndUpdate({_id:id, usuario:user}, {on_off:false}, {new:true}).catch((error)=>{
            console.log("erro ao atualizar status do grupo", error);
        });
    }catch(error){
        throw new Error(`Erro ao desligar grupo`, error);
    };
};

async function calcularDuracao(inicio, fim){
    try{
        Init = new Date(inicio);
        End = new Date(fim);

        const duracaoMs = Math.abs(End - Init);
        const duracao = Math.round(duracaoMs / 60000);
        let formato;

        if (duracao < 60) {
            return formato = `minutos:${duracao}`;
        } else {
            const horas = Math.floor(duracao / 60);
            const minutos = duracao % 60;
            return formato = `Horas: ${horas.toString().padStart(2, '0')}, Minutos: ${minutos.toString().padStart(2, '0')}`;
        };
    }catch(error){
        console.log(error);
    };
};

async function criarAgenda(corpo){
    try{
        const agenda = await AgendarDispositivos.create(corpo);
        return agenda;
    }catch(error){
        console.log("Erro ao criar agendamento!", error);
    };
};

async function criarAgendaGrupo(corpo){
    try{
        const agendaGrupo = await AgendarGrupos.create(corpo);
        return agendaGrupo;
    }catch(error){
        console.log(error,"Não foi possível criar uma agenda");
    };
};

async function getExpressionCronFromDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
  
    const expressionCron = `${second} ${minute} ${hour} ${day} ${month} * ${year}`;
  
    return expressionCron;
  }
  

async function agendarLigamento(idparams, body, sessionUser,inicio, fim, tipo){
    try{
        const init = new Date(inicio);
        const end = new Date(fim);
        const expressionCronInit = await getExpressionCronFromDate(init);
        const expressionCronEnd = await getExpressionCronFromDate(end);
        const  options = {
            scheduled: true,
            timezone: "America/Sao_Paulo"
        }
        if(tipo == "device"){
            const agendamentoDevice = await criarAgenda(body);   
            console.log(`${sessionUser} Agendou uma tarefa!`);
            cron.schedule(expressionCronInit, async function(){
                console.log("---------INIT------------");
                console.log("Dispositivo ligado!");
                on_dispositivo(idparams, body.dispositivo, sessionUser);;
            }, options);

            cron.schedule(expressionCronEnd, async function(){
                console.log("---------END-------------");
                console.log("Dispositivo desligado!");
                off_dispositivo(idparams, body.dispositivo, sessionUser);
                const duracao = await calcularDuracao(inicio, fim);
                AgendarDispositivos.findOneAndUpdate({_id:agendamentoDevice._id,id:idparams, usuario:sessionUser, HorasLigado:"none"}, {HorasLigado:duracao}, {new:true}).catch((erro)=>{
                console.log("Não foi possível atualizar!", erro)});
            }, options);
                
        }else if(tipo == "deviceGroup"){
            const dispositivosString = body.dispositivos;
            const dispositivosArray = dispositivosString.split(',');
            body.dispositivos = dispositivosArray;
            const agendamentoGroupDevice = await criarAgendaGrupo(body);
            console.log(`${sessionUser} Agendou uma tarefa!`);
            cron.schedule(expressionCronInit, async function(){
                console.log("---------INIT------------");
                console.log("Grupo ligado!");
                on_grupo(idparams, body.dispositivos, sessionUser);
            }, options);

            cron.schedule(expressionCronEnd, async function(){
                console.log("---------END-------------");
                console.log("Grupo desligado!");;
                off_grupo(idparams, body.dispositivos, sessionUser);
                const duracao = await calcularDuracao(inicio, fim);
                AgendarGrupos.findOneAndUpdate({_id:agendamentoGroupDevice._id, id:idparams, usuario:sessionUser, HorasLigado:"none"}, {HorasLigado:duracao}, {new:true}).catch((erro)=>{
                console.log("Erro ao atualizar horario!", erro);
                }, options);
            });
        };
    }catch (error){
        throw new Error("Não foi possível criar o Job");
    };
};

async function verifyTasks(tipo){
    try{
        if(tipo == "device"){
            const tarefas = await AgendarDispositivos.find({HorasLigado: "none"});
            if(tarefas.length>0){
                //console.log("Tarefas dos dispositivos encontradas!");
                const dataAtual = new Date();
                tarefas.forEach(task =>{
                    if(dataAtual >= task.inicio && dataAtual <=task.fim){
                        console.log("dentro do intervalo");
                        const init = getExpressionCronFromDate(task.inicio);
                        const end = getExpressionCronFromDate(task.fim);
                
                        cron.schedule(init, async function(){
                            on_dispositivo(task.id, task.dispositivo, task.usuario);
                        });
                        cron.schedule(end, async function(){
                            off_dispositivo(task.id, task.dispositivo, task.usuario);
                        });
                    }
                });
            }else if(tarefas.length === 0){
            }
            return tarefas;
        }else if (tipo == "deviceGroup"){
            const tarefas = await AgendarGrupos.find({HorasLigado: "none"});
            if(tarefas.length === 0){
            }else if(tarefas.length>0){
                console.log("Tarefas de grupos encontradas!");
                const dataAtual = new Date();
                tarefas.forEach(task =>{
                    if(dataAtual >= task.inicio && dataAtual <=task.fim){
                        console.log("dentro do intervalo");
                        const init = getExpressionCronFromDate(task.inicio);
                        const end = getExpressionCronFromDate(task.fim);

                        cron.schedule(init, async function(){
                            on_grupo(task.id, task.dispositivos, task.usuario);
                        });
                        cron.schedule(end, async function(){
                            off_grupo(task.id, task.dispositivos, task.usuario);
                        });
                        
                    }
                });
            };
        };
        
    }catch(error){
        throw new Error("Não foi possível verificar as tarefas, ", error);
    }
}

module.exports = {
    on_dispositivo,
    off_dispositivo,
    on_grupo,
    off_grupo,
    calcularDuracao,
    agendarLigamento,
    verifyTasks
};
