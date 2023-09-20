require("../collections/Adm");
require("../collections/Usuario");

const mongoose = require("mongoose");
const usuario  = mongoose.model("Usuarios");
const adm = mongoose.model("Admins");
const {get_html_message} = require("./EmailMessage");
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config()

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
OAuth2_client.setCredentials({refresh_token:process.env.REFRESH_TOKEN});

async function CriarContaAdm(body){
    try{
        const contaAdm = adm.create(body);
    }catch(error){
        console.log("Não foi possível cadastrar Adm", error);
    }
};

async function CadastrarCliente(body){
    try{
        const cliente = usuario.create(body);
    }catch(error){
        console.log("Não foi possível cadastrar cliente!");
    };
};

async function BuscarNomeAdm(email, senhaADM){
    try{
        const nomeAdm = await adm.findOne({email:email, senha:senhaADM});
        return nomeAdm;
    }catch (error){
        console.log("Não foi possível encontrar ADM!", error);
    };
};

async function BuscarNomeAdmEmail(emailAdm){
    try{
        const busca = await adm.findOne({email:emailAdm});
        return busca;
    }catch(error){
        console.log("Não foi possível encontrar o adm!", error);
    };
};

async function ExcluirContaCliente(nomeUser, emailUser){
    try{
        const excluir = await usuario.findOneAndDelete({nome:nomeUser, email:emailUser});
        return `Usuário ${nomeUser} foi excluído`;
    }catch(error){
        throw new Error(`Não foi possível excluir conta do cliente ${nomeUser} que possúi email ${emailUser}`, error);
    }
}

async function ExibirUsuarios(){
    try{
        const exibir = await usuario.find({});
        return exibir;
    }catch(error){
        console.log("Não foi possível exibir os usuários!",error);
    };
};

async function SendCredenciais(nome, nomeDestinatario,  emailDestinatario, login, senha){
    try{
        const accessToken = OAuth2_client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mail_options = {
            from: `${nome} <${process.env.EMAIL}>`,
            to: emailDestinatario, // list of receivers
            subject: "fornecimento de credenciais de acesso", // Subject line
            text: "Hello world?", // plain text body
            html: await get_html_message(nome, nomeDestinatario, login, senha)
        }

        await transporter.sendMail(mail_options, (error, result)=>{
            if(error){
                console.log("Error:", error);
            }else{
                console.log("Success:", result);
            }
            transporter.close();
        });

    }catch(error){
        console.log("Não foi possível fornecer credenciais!", error);
    };
};

module.exports = {
    BuscarNomeAdm,
    BuscarNomeAdmEmail,
    CriarContaAdm,
    CadastrarCliente,
    ExcluirContaCliente,
    ExibirUsuarios,
    SendCredenciais,

}