const {on_dispositivo, off_dispositivo,
on_grupo, off_grupo, calcularDuracao, agendarLigamento} = require("./AgendarFunctions");


exports.Agendar = async (req, res)=>{
    try{
        if(req.session.login){
            const agendamento = await agendarLigamento(req.params.id, req.body, req.session.login, req.body.inicio, req.body.fim, "device");
            res.redirect("/controle");
        };
    }catch(error){
        console.log("Erro ao agendar ligamento e desligamento");
    };
};

//Grupos:

exports.AgendarGrupo = async (req, res)=>{
    try{
        if(req.session.login){
            const agendamento = await agendarLigamento(req.params.id, req.body, req.session.login, req.body.inicio, req.body.fim, "deviceGroup");
            res.redirect("/grupos");
        };
    }catch(error){
        console.log("erro ao agendar ligamento e desligamento de grupos", error);
    };  
};