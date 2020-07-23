const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const pool = require("../database");
const helpers = require("../lib/helpers");
const router = require("../routes");

passport.use("local.signin", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, null);
        } else {
            done(null, false, req.flash("message", "Contraseña incorrecta"));
        }
    } else {
        return done(null, false, req.flash("message", "El nombre de usuario no existe"));
    }
}));

passport.use("local.signup", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { email } = req.body;
    const newUser = {
        username,
        password,
        email
    };
    const rows = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log(rows);
    if(rows.length > 0) {
        return done(null, false, req.flash("message", "El nombre de usuario ya existe"));
    }else {
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query("INSERT INTO users SET ?", [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
});
