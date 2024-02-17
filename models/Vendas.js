const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT
});

const Usuarios = require("./Usuarios");

const Vendas = sequelize.define("Vendas", {
    idvenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuarios,
            key: 'id'
        }
    },
    datavenda: {
        type: DataTypes.DATE,
    }
}, {timestamps: false});

Vendas.belongsTo(Usuarios, { foreignKey: 'id' });

Vendas.sync()
    .then(()=> {
        console.log("Tabela Vendas sincronizada com sucesso!");
    })
    .catch(() => {
        console.log("Houve um erro ao sincronizar a tabela Vendas");
    });

module.exports = Vendas;