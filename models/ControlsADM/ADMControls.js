const {CriarContaAdm, BuscarNomeAdm, ExibirUsuarios, CadastrarCliente, SendCredenciais, BuscarNomeAdmEmail, ExcluirContaCliente} = require("./admFunctions");
const jwt = require("jsonwebtoken");

exports.criarContaAdm = async (req, res)=>{
    try{
        const newConta = await CriarContaAdm(req.body);
        res.status(200).json({
            message:"conta adm foi criada com sucesso!"
        });
    }catch(error){
        console.log("Não foi possível criar contaADM", error);
    };
};

exports.logarAdm = async (req, res)=>{
    try{
        const usuarioADM = await BuscarNomeAdm(req.body.email, req.body.senha);
        req.session.login = usuarioADM.email;
        req.session.role = "adm";
        const payload = {
            info:usuarioADM
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5d"});
        const buscarUsuarios = await ExibirUsuarios();
        return res.render("TelasADM/index", {usuarios:buscarUsuarios, user:usuarioADM.nome});
    }catch(error){
        return res.status(401).json({
            err: true,
            message: "ADM não encontrado ou não foi cadastrado!"
        })
    }
};

exports.logout = async (req, res)=>{
    try{
        if(req.session.login && req.session.role === "adm"){
            req.session.destroy((error)=>{
                if(error){
                  console.log(error)
                  }else{
                    console.log("Deslogado com sucesso!");
                    res.redirect("/loginADM");
                };
              });
        }else{
            res.render("TelasADM/loginADM");
        };
    }catch(error){
        console.log("Não foi possível deslogar!");
    };
};

exports.cadastrarClient = async (req, res)=>{
    try{
        if(req.session.login && req.session.role === "adm"){
            await CadastrarCliente(req.body);
            res.status(200).json({
                message:"Cliente cadastrado!"
            });
        };
    }catch(error){
        console.log("Não foi possível cadastrar cliente", error);
        return res.status(400).json({
            message:"Não foi possível cadastrar cliente"
        })
    };
};

exports.fornecerCredenciais = async (req, res)=>{
    try{
        if(req.session.login && req.session.role === "adm"){
            const admNome = await BuscarNomeAdmEmail(req.session.login);
            const sendEmail = await SendCredenciais(admNome.nome, req.body.nomeDest, req.body.emailDest, req.body.login, req.body.senha);
            res.status(200).json({
                message:"Email enviado!"
            })
        };
    }catch(error){
        console.log("Não foi possível fornecer as credenciais para o usuário", error);
        res.status(400).json({
            message: "Erro no fornecimento de credênciais"
        });
    };  
};

exports.excluirContaCliente = async (req, res)=>{
    try{
        if(req.session.login && req.session.role === "adm"){
            const deletar = await ExcluirContaCliente(req.body.nome, req.body.email);
            res.status(200).send("ok");
        }else{
            res.redirect("/loginADM");
        }
    }catch(error){
        console.log("Não foi possível excluir cliente!");
    }
}