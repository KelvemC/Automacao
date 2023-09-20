const {ExibirUsuarios, BuscarNomeAdmEmail} = require("./admFunctions");

exports.telaLogin = async (req,res)=>{
    if(req.session.login && req.session.role === "adm"){
        res.redirect("/dashboardADM");
    }else{
        res.render("TelasADM/loginADM");
    };
};

exports.telaCadastroADM = async (req, res)=>{
        res.render("TelasADM/cadastroADM");
    
};

exports.telaCadastroClinte = async (req, res)=>{
    if(req.session.login && req.session.role === "adm"){
        const usuarioAdm = await BuscarNomeAdmEmail(req.session.login);
        res.render("TelasADM/cadastroCliente", {user:usuarioAdm.nome});
    };
};

exports.telaExibirClientes = async (req, res)=>{
    if(req.session.login && req.session.role === "adm"){
        const buscarUsuarios = await ExibirUsuarios();
        const admNome = await BuscarNomeAdmEmail(req.session.login);
        res.render("TelasADM/index", {usuarios:buscarUsuarios, user:admNome.nome});
    };
};
