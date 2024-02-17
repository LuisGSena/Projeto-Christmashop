require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const PORT = process.env.PORT;
const session = require("express-session");
const flash = require("connect-flash");
const mysql = require("mysql2")
const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcryptjs");
const app = express();

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const passport = require("passport");

require("./authentication/auth")(passport);

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT
});

const store = new MySQLStore(
  {
    host: process.env.DATABASE_HOST,
    port: 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  }
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    //   proxy: true,
    cookie: {
      maxAge: null,
      httpOnly: true,
      // secure: true,
    },
    name: process.env.COOKIE_NAME,
    store: store,
  })
);

store.onReady().then(() => {
  console.log('Banco conectado com sucesso!');
}).catch(error => {
  console.error(error);
});

// CONFIG DO PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// CONFIG DAS MENSAGENS FLASH
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

const Usuarios = require("./models/Usuarios");
const Produtos = require("./models/Produtos");
const Vendas = require("./models/Vendas");
const DetalheVendas = require("./models/DetalheVendas");

const admin = require("./routes/admin");
app.use("/admin", admin);

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    user = user.get({plain: true});
    console.log(user);

    let produtos_mais_vendidos = await Produtos.findAll({});
    produtos_mais_vendidos = produtos_mais_vendidos.map(produto_mais_vendido => produto_mais_vendido.get({plain: true}));

    let artigos_de_decoracao = await Produtos.findAll({where: { categoria: "Decoração" }});
    artigos_de_decoracao = artigos_de_decoracao.map(artigo_de_decoracao => artigo_de_decoracao.get({plain: true}));

    let presentes_personalizados = await Produtos.findAll({where: { categoria: "Presentes" }});
    presentes_personalizados = presentes_personalizados.map(presente_personalizado => presente_personalizado.get({plain: true}));

    res.render("pages/homeLogado", { user: user, produtos_mais_vendidos: produtos_mais_vendidos, artigos_de_decoracao: artigos_de_decoracao, presentes_personalizados: presentes_personalizados });
  } else {
    let produtos_decoracao = await Produtos.findAll({where: { categoria: "Decoração" }, limit: 3});
    produtos_decoracao = produtos_decoracao.map(produto_decoracao => produto_decoracao.get({plain: true}));
    let produtos_personalizados = await Produtos.findAll({where: { categoria: "Presentes" }, limit: 4});
    produtos_personalizados = produtos_personalizados.map(produto_personalizado => produto_personalizado.get({plain: true}));
    res.render("pages/home", {produtos_decoracao: produtos_decoracao, produtos_personalizados: produtos_personalizados});
  }
});

app.get("/presentes-personalizados", async (req, res) => {
  let presentes_personalizados = await Produtos.findAll({where: { categoria: "Presentes" }});
  presentes_personalizados = presentes_personalizados.map(presente_personalizado => presente_personalizado.get({plain: true}))
  res.render("pages/presentes_personalizados", { presentes_personalizados: presentes_personalizados });
});

app.get("/artigos-de-decoracao", async(req, res) => {
  if(req.isAuthenticated()) {
    let artigos_de_decoracao = await Produtos.findAll({where: { categoria: "Decoração" }});
    artigos_de_decoracao = artigos_de_decoracao.map(artigo_de_decoracao => artigo_de_decoracao.get({plain: true}))
    res.render("pages/artigos_de_decoracao_logado", { artigos_de_decoracao: artigos_de_decoracao });
  }else{
    let artigos_de_decoracao = await Produtos.findAll({where: { categoria: "Decoração" }});
    artigos_de_decoracao = artigos_de_decoracao.map(artigo_de_decoracao => artigo_de_decoracao.get({plain: true}))
    res.render("pages/artigos_de_decoracao", { artigos_de_decoracao: artigos_de_decoracao });
  }
});

app.get("/cadastro", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("error_msg", "Você precisa deslogar para continuar!");
    res.redirect("/");
  } else {
    res.render("pages/cadastro");
  }
});

app.get("/carrinho", (req,res) =>{
  res.render("pages/carrinho")
})

app.post("/cadastro", async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const datanascimento = req.body.datanascimento;
  const telefone = req.body.telefone;
  const cpf = req.body.cpf;
  const password = req.body.password;
  const password_repeat = req.body.password_repeat;

  if (!req.isAuthenticated) {
    req.flash("error_msg", "Você precisa deslogar para concluir o seu cadastro. Tente novamente.");
    res.redirect("/");
  } else {
    let emailFound = await Usuarios.findOne({ where: { email: email } });
    let cpfFound = await Usuarios.findOne({ where: { cpf: cpf } });
    if (password !== password_repeat) {
      req.flash("error_msg", "Senhas não coincidem, tente novamente.");
      res.redirect("/cadastro");
    } else if (emailFound) {
      req.flash("error_msg", "Este e-mail já está cadastrado, tente novamente.");
      res.redirect("/cadastro");
    } else if (cpfFound) {
      req.flash("error_msg", "Este CPF já está cadastrado, tente novamente.");
      res.redirect("/cadastro");
    } else {
      bcrypt.genSalt(10, async (erro, salt) => {
        bcrypt.hash(password, salt, async (erro, hash) => {
          if (erro) {
            req.flash("error_msg", "Houve um erro com o envio do formulário, tente novamente");
            res.redirect("/cadastro");
          } else {
            await Usuarios.create({ cpf: cpf, nome: name, telefone: telefone, datanascimento: datanascimento, email: email, endereco: "", datacadastro: new Date(), senha: hash, adm: 1 })
            req.flash("success_msg", "Cadastro efetuado com sucesso! faça login para continuar!");
            res.redirect("/login");
          }
        });
      });

    }
  }

});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("error_msg", "Você já fez login!");
    res.redirect("/");
  } else {
    res.render("pages/login");
  }
});

app.post("/login", async (req, res, next) => {
  try {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })(req, res, next);

  } catch (err) {
    req.flash("error_msg", "Houve um erro ao fazer login, tente novamente.");
    res.redirect("/login");
  }

});

app.get("/carrinho", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "Você precisa fazer login para continuar!");
    res.redirect("/");
  } else {
    res.render("pages/carrinho");
  }
});

app.post("/carrinho", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "Você precisa fazer login para continuar!");
    res.redirect("/");
  } else {
    // adicionar
    res.status(200);
  }
});

app.post("/remover-carrinho", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "Você precisa fazer login para continuar!");
    res.redirect("/");
  } else {
    // remover
    res.status(200);
  }
});

app.get("/favoritos", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "Você precisa fazer login para continuar!");
    res.redirect("/");
  } else {
    res.render("pages/favoritos");
  }
});

app.post("/favoritos", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "Você precisa fazer login para continuar!");
    res.redirect("/");
  } else {
    res.status(200).json({message: "Produto adicionado aos favoritos."});
  }
});

app.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      req.flash("success_msg", "Deslogado com sucesso!");
      res.redirect("/login");
    });
  } catch (err) {
    req.flash("error_msg", "Houve um erro ao deslogar o usuário, tente novamente.");
    res.redirect("/");
  }
});

app.listen(8080, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});