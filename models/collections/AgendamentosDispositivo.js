const mongoose = require("mongoose");
const Agendamentos = new mongoose.Schema({
    usuario:{
        type: String,
        required: true
    },
    dispositivo:{
        type: String,
        required: true
    },
    inicio:{
        type: Date,
        required: true
    },
    fim:{
        type: Date,
        required: true
    },
    HorasLigado:{
        type: String,
        default: "none"
    },
    id:{
        type: String,
        required: true,
    }
});

mongoose.model("AgendamentoDispositivo", Agendamentos);