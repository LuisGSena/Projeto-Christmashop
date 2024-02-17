const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT
});

const Vendas = require("./Vendas");
const Produtos = require("./Produtos");

const DetalheVendas = sequelize.define("DetalheVendas", {
    idDetalhe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idvenda: {
        type: DataTypes.INTEGER,
        references: {
            model: Vendas,
            key: 'idvenda'
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        references: {
            model: Produtos,
            key: 'idProduto'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
    },
    valorunitario: {
        type: DataTypes.FLOAT,
    },
    horariocompra: {
        type: DataTypes.DATE,
    },
}, {timestamps: false});

DetalheVendas.belongsTo(Vendas, { foreignKey: 'idvenda' });
DetalheVendas.belongsTo(Produtos, { foreignKey: 'idProduto' });

DetalheVendas.sync()
    .then(()=> {
        console.log("Tabela DetalheVendas sincronizada com sucesso!");
    })
    .catch(() => {
        console.log("Houve um erro ao sincronizar a tabela DetalheVendas");
    });

module.exports = DetalheVendas;