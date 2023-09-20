require("../collections/Usuario");
require("../collections/Dispositivo");
require("../collections/Grupo");

const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Dispositivo = mongoose.model("Dispositivos");
const Grupo = mongoose.model("Grupos");

async function BuscarRegistroUsuario(sessaoUsuario){
  try{
    const usuario = await Usuario.findOne({email: sessaoUsuario});
    return usuario;
  } catch(error){
    throw new Error("Não foi possível encontar o registro, verifique se o usuário existe!");
  }
}

async function BuscarNomeUsuario(emailUser, password) {
  try {
    const usuario = await Usuario.findOne({ email: emailUser, senha: password });
    return usuario;
  } catch (error) {
    throw new Error("Não foi possível encontrar o usuário, verifique se foi cadastrado ou ou se os parâmetros estão corretos!"); // Se necessário, relance o erro para ser tratado posteriormente
  };
};

async function BuscarDispositivos(sessaoUsuario){
  try{
      const dispositivo = await Dispositivo.find({usuario:sessaoUsuario});
      return dispositivo;
  } catch (error) {
      throw new Error("Não foi possível encontrar o dispositivo, verifique se foi cadastrado ou se os parâmetros estão corretos!");
  };
};

async function BuscarDispositivoEspecifico(id, sessaoUsuario){
  try{
    const dispositivo = await Dispositivo.findOne({_id:id, usuario: sessaoUsuario});
    return dispositivo;
  } catch(error){
    throw new Error("Não foi possível encontrar o dispositivo, verifique se foi cadastrado ou se os parâmetros estão corretos!")
  };
};

async function BuscarDispositivoEspecificoUsuario(sessaoUsuario, estado){
  try{
    const dispositivo = await Dispositivo.find({usuario: sessaoUsuario, used: estado});
    return dispositivo;
  } catch(error){
    throw new Error("Não foi possível encontrar dispositivos específicos do usuário:", sessaoUsuario, ", verifique se os dispositivos do usuário foram cadastrados e se o token está válido!");
  }
}

async function BuscarGrupo(sessaoUsuario){
  try{
    const grupos = await Grupo.find({usuario:sessaoUsuario});
    return grupos;
  }catch (error){
    throw new Error("Não foi possível encontrar um grupo, verifique se foi cadastrado ou se os parâmetros estão corretos!");
  };
};

async function BuscarGrupoEspecifico(id, sessaoUsuario){
  try{
    const grupo = await Grupo.findOne({_id: id, usuario: sessaoUsuario});
    return grupo;
  }catch(error){
    throw new Error("Não foi possível encontrar o grupo específico, verifique se houve um cadastro, ou se os parâmetros estão corretos!");
  };
};

async function BuscarDispositivosEmailESP8266(email, estado){
  try{
    const dispositivo = await Dispositivo.find({usuario:email, used: estado});
    return dispositivo;
  } catch(error){
    throw new Error("Não foi possível encontrar dispositivos específicos do usuário:", sessaoUsuario, ", verifique se os dispositivos do usuário foram cadastrados e se o token está válido!");
  };
};

async function CriarDispositivo(json){
  try{
    const novo_dispositivo = await Dispositivo.create(json);
    return "Dispositivo foi criado com sucesso!";
  } catch(error){
    throw new Error("Não foi possível criar o dispositivo, verifique se os parâmetros estão corretos!");
  };
};

async function CriarGrupo(json){
  try{
    const grupo = await Grupo.create(json);
    return "Grupo foi criado com sucesso!";
  } catch(error){
    throw new Error("Não foi possível criar o grupo, verifique se os parâmetros estão corretos!");
  };
};

async function AtualizarStatusDispositivoEspecifico(id, sessaoUsuario, estado){
  try{
    const atualizar_status = await Dispositivo.findOneAndUpdate({_id:id, usuario:sessaoUsuario}, {on_off:estado}, {new:true});
    return "Status atualizado com sucesso!";
  }catch(error){
    console.log(error);
  }
}

async function AtualizarStatusDispositivo(nome, sessaoUsuario, estado){
  try{
    const dispositivos = await Dispositivo.findOneAndUpdate({nome:nome, usuario: sessaoUsuario}, {on_off:estado}, {new: true});
    return "Dispositivo foi atualizado com sucesso!";
  } catch(error){
    throw new Error("Não foi possível atualizar o dispositivo, verifique os parâmetro e se ele existe no sistema!");
  };
};

async function AtualizarStatusESP8266(id, estado){
  try{
    const dispositivo = await Dispositivo.findOneAndUpdate({_id:id}, {used:estado.used}, {new:true});
    return "Dispositivo atualizado!";
  }catch(error){
    throw new Error("Não foi possível atualizar o dispositivo, verifique os parâmetros e se ele existe no sistema!");
  }
}

async function atualizarStatusGrupo(id, sessaoUsuario, estado){
  try{
    const grupo = await Grupo.findOneAndUpdate({_id:id, usuario:sessaoUsuario}, {on_off:estado}, {new:true});
    return "Grupo foi atualizado com sucesso!"
  } catch(error){
    throw new Error("Não foi possível atualizar o grupo de dispositivos, verifique os parâmetros e se ele existe no sistema!");
  };
};

async function atualizarWiFi_Senha(id, sessaoUsuario, corpo,){
  try{
    const filtro = {_id:id, usuario:sessaoUsuario};
    const atualizado = {wifi:corpo.wifi, senha_wifi:corpo.senha_wifi};
    const dispositivoEditado = await Dispositivo.findOneAndUpdate(filtro, atualizado);
    return "WiFi e senha do dispositivo editado com sucesso!";
  }catch(error){
    throw new Error("Não foi possível editar o wifi e a senha do dispositivo, verifique se os parâmetros estão corretos e se o dispositivo está registrado!");
  }
}

async function deletarDispositivo(id, sessaoUsuario){
  try{
    const dispositivo = await Dispositivo.findOneAndRemove({_id:id, usuario:sessaoUsuario});
    return "Dispositivo deletado com sucesso!";
  } catch(error){
    throw new Error("Não foi possível deletar o dispositivo, verifique se ele existe ou se os parâmetros estão corretos!");
  }
};

async function deletarGrupo(id, sessaoUsuario){
  try{
    const grupo = await Grupo.findOneAndRemove({_id:id, usuario:sessaoUsuario});
    return "Grupo deletado com sucesso!";
  } catch(error){
    throw new Error("Não foi possível deletar o grupo, verifique se ele existe ou se os parâmetros estão corretos!");
  }
};

module.exports = {
    BuscarRegistroUsuario,BuscarNomeUsuario,
    BuscarDispositivos,BuscarDispositivoEspecifico,
    BuscarGrupo,BuscarGrupoEspecifico,
    BuscarDispositivoEspecificoUsuario,CriarDispositivo,
    CriarGrupo,AtualizarStatusDispositivo,atualizarStatusGrupo, atualizarWiFi_Senha,
    deletarDispositivo,deletarGrupo, AtualizarStatusESP8266, BuscarDispositivosEmailESP8266,
    AtualizarStatusDispositivoEspecifico
}