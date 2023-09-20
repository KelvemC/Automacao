const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const path = require("path");
const control = require("./models/ControlUser/Controls");
const controlAdm = require("./models/ControlsADM/ADMControls");
const telasAdm = require("./models/ControlsADM/TelasADM");
const telasUsuario = require("./models/ControlUser/TelasUsuario");
const Agendamento = require("./models/Agenda/Agendamentos");
const AgendamentoFunctions = require("./models/Agenda/AgendarFunctions");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config()
//Session Config

const store = new MongoDBStore({
  uri: process.env.URI,
  collection: 'sessions',
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(session({secret:process.env.SECRETSESSION, resave: false, saveUninitialized: false, store: store, cookie:{maxAge: 1000 * 60 * 60 * 24}}));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({
    extended: true
}));

control.MQTT.conectarBroker();
AgendamentoFunctions.verifyTasks("device");
AgendamentoFunctions.verifyTasks("deviceGroup");

//criando sistema para renderizar arquivo de forma automático
app.engine("html", require("ejs").renderFile); //setando a engine para renderização do tipo html, usando o ejs
app.set("view engine", "html");//setando a view engine para ser html
app.use("/public", express.static(path.join(__dirname, "public")));//dizendo onde fica o diretório estatático com arquivos, fotos, css, tudo que é estático
app.set("/views", path.join(__dirname, "views"));//dizendo onde está a página com as views

//Rotas User;
//Rotas get
app.get("/", telasUsuario.telaLogin);
app.get("/controle", telasUsuario.HomePage);
app.get("/cadastrarDispositivos", telasUsuario.telaCriarDispositivos);
app.get("/editarDispositivo/:id", telasUsuario.telaEditarDispositivo);
app.get("/meus-dispositivos/:email", control.ESP8266Request);
app.get("/deletarDispositivo/:id", telasUsuario.telaDeletarDispositivo);
app.get("/deletar/grupos/device/:id", telasUsuario.telaDeletarGrupo);
app.get("/grupos", telasUsuario.telaGrupos);
app.get("/erro", telasUsuario.telaErro);
app.get("/logout", control.logout);
app.get("/criarGrupo", telasUsuario.telaCriarGrupo);

//rotas post
app.post("/dispositivo", control.criarDevice);
app.post("/", control.login);
app.post("/criarGrupoDevice", control.criarGroupDevice);
app.post("/on_off/dispositivo/:id", control.ligar_desligar_Dispositivo);
app.post("/on_off/grupo/:id", control.ligar_desligar_Grupo);
app.post("/agendamento/dispositivo/:id", Agendamento.Agendar);
app.post("/agendamento/grupo/:id", Agendamento.AgendarGrupo);
app.post("/editarWiFi/:id", control.editarWifi);
app.post("/deltopic/:id", control.enviarMQTTdelete);

//rotas put
app.put("/editar/dispositivo/:id", control.editar);
app.put("/editar/dispositivo/esp8266/:id", control.ESP8266PUT);

//rotas delete
app.delete("/deletar/dispositivo/:id", control.deletarDevice);
app.delete("/deletar/grupo/:id", control.deletarGrupoDevice);

//Rotas ADM
app.get("/loginADM", telasAdm.telaLogin);
app.get("/logoutADM", controlAdm.logout);
app.get("/cadastroADM", telasAdm.telaCadastroADM);
app.get("/criarContaCliente", telasAdm.telaCadastroClinte);
app.get("/dashboardADM", telasAdm.telaExibirClientes);

app.post("/criarContaADM", controlAdm.criarContaAdm);
app.post("/logarADM", controlAdm.logarAdm);
app.post("/cadastrarContaCliente", controlAdm.cadastrarClient);
app.post("/fornecerCredenciais", controlAdm.fornecerCredenciais);

app.delete("/deletarCliente", controlAdm.excluirContaCliente);
mongoose.set("strictQuery", true);
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB', err));

app.listen(process.env.PORT,()=>{
    console.info("Aplicação rodando em http://simenergy-production.up.railway.app");
    console.info("Aplicação rodando em http://localhost:" + process.env.PORT);
});