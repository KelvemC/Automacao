//telas:
const {BuscarDispositivos, BuscarDispositivoEspecifico, BuscarGrupo, BuscarGrupoEspecifico} = require("./UserFunctions");
const moment = require("moment-timezone");

exports.telaLogin = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        res.redirect("/controle");
      }else if(req.session.login && req.session.role == "adm"){
        res.redirect("/dashboardADM");
      }else{
        res.render("TelasUsuario/login");
      };
    } catch(error){
      console.log(error.message);
    };
  };
  
  exports.HomePage = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        const dispositivo = await BuscarDispositivos(req.session.login);
        const dataHoraBrasil = moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm');
        res.render("TelasUsuario/index", {deviceList: dispositivo, user:req.session.login, currentDate: dataHoraBrasil});
      }else{
        console.log("É preciso efetuar o login de usuário!");
        res.redirect("/");
      };
    } catch(error){
      console.log(error.message);
    };
  };
  
  exports.telaCriarDispositivos = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        return res.render("TelasUsuario/cadastro", {user:req.session.login});
      }else{
        console.log("É preciso efetuar o login de usuário!");
        return res.redirect("/");
      };
    }catch(error){
      console.log(error.message);
    };
  };
  
  exports.telaCriarGrupo = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        const dispositivo = await BuscarDispositivos(req.session.login);
        return res.render("TelasUsuario/criarGrupos", {deviceList:dispositivo, user:req.session.login});
      }else{
        console.log("É preciso efetuar o login de usuário!");
        return res.redirect("/");
      };
    } catch(error){
      console.log(error.message);
    };
  };
  
  exports.telaGrupos = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        const grupos = await BuscarGrupo(req.session.login);
        const dataHoraBrasil = moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm');
        return res.render("TelasUsuario/grupos", {deviceList:grupos, user:req.session.login, currentDate:dataHoraBrasil});
      }else{
        console.log("É preciso efetuar login");
        return res.redirect("/");
      };
    } catch(error){
      console.log(error.message);
    };
  };
  
  exports.telaEditarDispositivo = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        const dispositivo = await BuscarDispositivoEspecifico(req.params.id, req.session.login);
        return res.render("TelasUsuario/editar", {device: dispositivo, user:req.session.login});
      }else{
        console.log("É preciso efetuar o login de usuário!");
        return res.redirect("/");
      };
    } catch(error){
      console.log(error.message);
    };
  };
  
  exports.telaDeletarDispositivo = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        const dispositivo = await BuscarDispositivoEspecifico(req.params.id, req.session.login);
        return res.render("TelasUsuario/excluir", {device: dispositivo});
      }else{
        console.log("É preciso efetuar o login de usuário!");
        return res.redirect("/");
      };
    } catch(error){
      console.log(error.message);
    };
  };
  
  exports.telaDeletarGrupo = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        const grupo = await BuscarGrupoEspecifico(req.params.id, req.session.login);
        return res.render("TelasUsuario/excluirGrupo", {device: grupo});
      }else{
        console.log("É preciso efetuar o login de usuário!")
        return res.redirect("/");
      }
    }catch(error){
      console.log(error.message);
    }
  }
  
  
  
  exports.telaErro = async (req, res)=>{
    try{
      if(req.session.login && req.session.role === "usuario"){
        res.render("TelasUsuario/aviso");
      }else{
        console.log("É preciso efetuar o login de usuário!");
        return res.redirect("/");
      };
    } catch(error){
      console.log(error.message);
    };
  };