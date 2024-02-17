const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const Usuarios = require("../models/Usuarios");

module.exports = function (passport) {
    passport.use(new localStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done) => {
            await Usuarios.findOne({where: {email: email} })
                .then((usuario) => {
                    if (!usuario) {
                        return done(null, false, { message: "Usuário não encontrado." });
                    } else {
                        bcrypt.compare(password, usuario.senha, (erro, isValid) => {
                            if (isValid) {
                                return done(null, usuario);
                            } else {
                                console.log(password);
                                console.log(email);
                                console.log(usuario.senha);
                                console.log(usuario)
                                return done(null, false, { message: "Senha incorreta. Tente novamente." });
                            }
                        });
                    }
                })
                .catch((err) => {
                    return done(err, false, { message: "Houve um erro ao autenticar o usuário, tente novamente mais tarde." });
                });
        }
    ));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser(async (id, done) => {
        await Usuarios.findOne({where: {id: id}})
            .then((usuario) => {
                if (!usuario) {
                    done(null, false, { message: "Houve um erro ao carregar o usuário. Tente novamente." });
                } else {
                    done(null, usuario);
                }
            })
            .catch((err) => {
                done(err, false, { message: "Houve um erro ao carregar o usuário. Tente novamente." });
            });
    });
}