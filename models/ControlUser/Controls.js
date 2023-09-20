const {BuscarNomeUsuario, BuscarDispositivos, BuscarDispositivoEspecifico, BuscarGrupo, BuscarGrupoEspecifico,
  CriarDispositivo, CriarGrupo, AtualizarStatusDispositivo, atualizarStatusGrupo,
  deletarDispositivo, deletarGrupo, BuscarDispositivoEspecificoUsuario, BuscarRegistroUsuario,
  atualizarWiFi_Senha, AtualizarStatusESP8266, BuscarDispositivosEmailESP8266, AtualizarStatusDispositivoEspecifico
} = require("./UserFunctions");
require("dotenv").config();

const moduloMQTT = require("../mqttConnect/ConnectBroker");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");

exports.MQTT = moduloMQTT;

exports.login = async (req, res) => {
  try {
    const usuario = await BuscarNomeUsuario(req.body.email, req.body.senha);
    req.session.login = usuario.email;
    req.session.role = "usuario";
    const payload = {
      info: usuario
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5d"});
    moduloMQTT.EnviarToken(req.session.login, token);
    const dataHoraBrasil = moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm');
    const registro = await BuscarDispositivos(req.session.login);
    console.log(token);
    return res.render("TelasUsuario/index", {deviceList: registro, user:req.session.login, currentDate: dataHoraBrasil});
  } catch (error) {
    //console.log("Falha login:", error);
    return res.status(401).json({
      error: true,
      message: "Credênciais inválidas"
    });
  };
};

exports.logout = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      req.session.destroy((error)=>{
        if(error){
          console.log(error)
          }else{
            console.log("Deslogado com sucesso!");
            res.redirect("/");
        };
      }); 
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.criarDevice = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const dispositivo = await CriarDispositivo(req.body);
      res.redirect("/controle");
    };
  } catch(error){
    console.log(error.message);
  }; 
};

exports.criarGroupDevice = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const grupo = await CriarGrupo(req.body);
      res.redirect("/grupos");
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.novoStatus = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const status = await AtualizarStatusDispositivo(req.body, (err)=>{
        if(err){
          return res.status(400).json({
            message: "Status não atualizado!"
          });
        }else{
          return res.status(200).json({
            message: "Status Atualizado!"
          });
        };
      }); 
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.editar = async (req,res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const atualizar = await atualizarWiFi_Senha(req.params.id, req.session.login, req.body);
      if(atualizar){
        res.status(200).json({
          message: "Dipositivo editado"
        });
      }else{
        res.status(400).json({
          message: "Erro ao editar",
        });
      };
    }else{
      res.redirect("/");
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.editarWifi = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const dispositivo = await BuscarDispositivoEspecifico(req.params.id, req.session.login);
      moduloMQTT.editar(dispositivo.nome);
      res.status(200).json({
        message: "Editar Enviado com sucesso!"
      })
    }else{
      res.redirect("/");
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.deletarDevice = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const dispositivo = await BuscarDispositivoEspecifico(req.params.id, req.session.login);
      const deletar = await deletarDispositivo(req.params.id, req.session.login);
      if(deletar){
        moduloMQTT.remover(dispositivo.nome);
        res.status(200).json({
          message:"Dispositivo deletado!",
        });
      }else{
        res.status(400).send("Requisição inválida");
      };
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.deletarGrupoDevice = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const deletar = await deletarGrupo(req.params.id, req.session.login);
      if(deletar){
        res.status(200).json({
          message:"Grupo deletado!",
        })
      }else{
        res.status(400).send("Requisição inválida");
      };
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.enviarMQTTdelete = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const dispositivo = await BuscarDispositivoEspecifico(req.params.id, req.session.login);
      moduloMQTT.remover(dispositivo.nome);
    }else{
      res.redirect("/");
    };
  } catch(error){
    console.log(error.message);
  };
};

exports.ESP8266Request = async (req, res)=>{
  try{
    const token = req.headers.authorization;
    if(token){
      const token_value = token.split(' ')[1]; // Obtém o token da requisição
      const decoded = jwt.verify(token_value, process.env.JWT_SECRET);
      const dispositivo = await BuscarDispositivosEmailESP8266(req.params.email, false);
      return res.json(dispositivo);
    }else{
      return res.status(400).json({
        message:"token não foi passado!"
      });
    };
    
  } catch(error){
    console.log(error.message);
  };
};

exports.ESP8266PUT = async (req, res)=>{
  try{
    const token = req.headers.authorization;
    if(token){
      const token_value = token.split(' ')[1]; // Obtém o token da requisição
      const decoded = jwt.verify(token_value, process.env.JWT_SECRET);
      const dispositivo_atualizado = await AtualizarStatusESP8266(req.params.id, req.body);
      res.status(200).json({
        message: "dispositivo atualizado!"
      });
      console.log("Dispositivo atualizado!");
    }else{
      res.status(400).json({
        message: "token não foi passado!"
      });
    };
    
  } catch(error){
    console.log(error.message);
  };
};

exports.ligar_desligar_Dispositivo = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      if(req.body.estado == true){
        await moduloMQTT.ligar(req.body.nome);
      }else{
        await moduloMQTT.desligar(req.body.nome);
      };
      const atualizarStatus = await AtualizarStatusDispositivoEspecifico(req.body.id, req.session.login, req.body.estado);
      res.status(200).send("ok");
    }else{
      res.redirect("/");
    };
  } catch(error){
    console.log(error);
  };
};



exports.ligar_desligar_Grupo = async (req, res)=>{
  try{
    if(req.session.login && req.session.role === "usuario"){
      const grupo = await BuscarGrupoEspecifico(req.body.id, req.session.login);
      if(req.body.estado == true){
        const atualizar_status = await atualizarStatusGrupo(req.body.id, req.session.login, req.body.estado);
        grupo.dispositivos.forEach(async element => {
          await moduloMQTT.ligar(element);
          const atualizar = await AtualizarStatusDispositivo(element, req.session.login, req.body.estado);
        });
        
      }else{
        const atualizar_status = await atualizarStatusGrupo(req.body.id, req.session.login, req.body.estado);
        grupo.dispositivos.forEach(async element => {
          await moduloMQTT.desligar(element);
          const atualizar = await AtualizarStatusDispositivo(element, req.session.login, req.body.estado);
        });
      };
    }else{
      res.redirect("/");
    };
  } catch(error){
    console.log(error);
  };
};
