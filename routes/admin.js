const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.adm === 1) {
            next();
        } else {
            req.flash("error_msg", "Você precisa ser uma administrador para prosseguir.");
            res.redirect("/");
        }
    } else {
        req.flash("error_msg", "Você precisa fazer login para prosseguir!");
        res.redirect("/login");
    }
});

const Produtos = require("../models/Produtos");

router.get("/", async (req, res) => {
    let allProducts = await Produtos.findAll({ where: { deleted: 0 } });
    allProducts = allProducts.map(product => product.get({ plain: true }));
    res.render("pages/homeAdmin", { layout: "admin", allProducts: allProducts });
});

router.get("/adicionar", (req, res) => {
    res.render("pages/adicionarProd", { layout: "admin" });
});

router.get("/sem-estoque", async (req, res) => {
    try {
        const allProducts = await Produtos.findAll({
            where: {
                qntdestoque: {
                    [Op.lte]: 50,
                },
                deleted: 0
            },
            order: [
                ['qntdestoque', 'ASC'],
            ],
        });

        const plainProducts = allProducts.map((product) => product.get({ plain: true }));

        res.render("pages/semEstoque", { layout: "admin", allProducts: plainProducts });
    } catch (error) {
        console.error("Erro ao buscar produtos sem estoque:", error);
        res.status(500).send("Erro interno do servidor");
    }
});

router.post("/editar-produto", async (req, res) => {
    const idProduto = req.body.idProduto;
    const nomeProduto = req.body.nomeProduto;
    const descricao = req.body.descricao;
    const qntdestoque = req.body.qntdestoque;
    const valorunidade = req.body.valorunidade;
    const categoria = req.body.categoria;
    const produto = await Produtos.findOne({ where: { idProduto: idProduto } });

    produto.nomeProduto = nomeProduto;
    produto.descricao = descricao;
    produto.qntdestoque = qntdestoque;
    produto.valorunidade = valorunidade;
    produto.categoria = categoria;

    await produto.save();
    req.flash("success_msg", "Mudança feita com sucesso!");
    res.redirect("/admin");
});

router.post("/atualizar-estoque", async (req,res) =>{
    const idProduto = req.body.idProduto;
    const qntdestoque = req.body.qntdestoque;
    const produto = await Produtos.findOne({ where: { idProduto: idProduto } });

    produto.qntdestoque = qntdestoque;

    await produto.save();
    req.flash("success_msg", "Mudança de Estoque feita com sucesso!");
    res.redirect("/admin/sem-estoque");
});

router.post("/deletar-produto", async (req, res) => {
    try {
        const idProduto = req.body.idProduto;

        await Produtos.update({ deleted: 1 }, { where: { idProduto: idProduto } });

        req.flash("success_msg", "Produto deletado com sucesso!");
        res.redirect("/admin");
    } catch (error) {
        console.error("Erro ao deletar o produto:", error);
        req.flash("error_msg", "Erro ao deletar o produto.");
        res.redirect("/admin");
    }
});

router.post("/add-produto", async (req, res) => {
    try {
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let quantidade = req.body.quantidade;
        let valor = req.body.valor;
        let categoria = req.body.categoria;
        await Produtos.create({nomeProduto: nome, descricao: descricao, qntdestoque: quantidade, valorunidade: valor, categoria:categoria});
        req.flash("success_msg", "Produto adicionado com sucesso!")
        res.redirect("/admin");
    } catch (error) {
        console.error("Erro ao adicionar o produto:", error);
        req.flash("error_msg", "Erro ao adicionar o produto.");
        res.redirect("/admin");
    }
});

module.exports = router;