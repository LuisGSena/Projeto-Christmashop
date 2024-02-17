const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT
});

const Produtos = sequelize.define("produtos", {
    idProduto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeProduto: {
        type: DataTypes.STRING(100)
    },
    descricao: {
        type: DataTypes.STRING(1000)
    },
    categoria: {
        type: DataTypes.ENUM("Decoração", "Presentes", "Cartões de Natal")
    },
    datadeentrada: {
        type: DataTypes.TIME
    },
    dataval: {
        type: DataTypes.STRING(10)
    },
    qntdestoque: {
        type: DataTypes.INTEGER,
    },
    valorunidade: {
        type: DataTypes.FLOAT,
    },
    slug: {
        type: DataTypes.STRING(100)
    },
    deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {timestamps: false});

Produtos.sync()
    .then(()=> {
        console.log("Tabela Produtos sincronizada com sucesso!");
    })
    .catch(() => {
        console.log("Houve um erro ao sincronizar a tabela Produtos");
    });

module.exports = Produtos;