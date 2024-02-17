const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT
});

const Usuarios = sequelize.define("usuarios", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cpf: {
        type: DataTypes.STRING(14)
    },
    senha: {
        type: DataTypes.STRING(500)
    },
    nome: {
        type: DataTypes.STRING(100)
    },
    telefone: {
        type: DataTypes.STRING(15)
    },
    datanascimento: {
        type: DataTypes.STRING(10)
    },
    email: {
        type: DataTypes.STRING(40)
    },
    endereco: {
        type: DataTypes.STRING(50)
    },
    datacadastro: {
        type: DataTypes.DATE
    },
    adm: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {timestamps: false});

Usuarios.sync()
    .then(()=> {
        console.log("Tabela Usuarios sincronizada com sucesso!");
    })
    .catch(() => {
        console.log("Houve um erro ao sincronizar a tabela usuarios");
    });

module.exports = Usuarios;