const mongoose = require("mongoose");
const Usuario = new mongoose.Schema({
    nome:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    senha:{
        type:String,
        required: true
    },
    quantLamp:{
        type:Number,
        required: true
    },
},{
    timestamps: true
});

mongoose.model("Usuarios", Usuario);