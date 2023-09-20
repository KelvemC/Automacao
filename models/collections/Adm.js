const mongoose = require("mongoose");
const Admin = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

mongoose.model("Admins", Admin);