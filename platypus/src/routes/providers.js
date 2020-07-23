const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/", isLoggedIn, async (req, res) => {
    res.render("products/search");
});

router.get("/add", isLoggedIn, (req, res) => {
    res.render("providers/add");
});

router.get("/search", isLoggedIn, async (req, res) => {
    res.render("providers/search");
});

router.get("/search-all", isLoggedIn, async (req, res) => {
    var providers = await pool.query("SELECT * FROM providers WHERE user_id = ? ORDER BY name", [req.user.id]);
    if(providers.length != 0) {
        res.render("providers/search", { providers });
    }else {
        req.flash("message", "Lista de proveedores vacia");
        res.redirect("/providers/search");
    }
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const providers = await pool.query("SELECT * FROM providers WHERE id = ?", [id]);
    res.render("providers/edit", {provider : providers[0]});
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM providers WHERE ID = ?", [id]);
    req.flash("success", "Proveedor removido correctamente");
    res.redirect("/providers/search");
});

router.post("/add", isLoggedIn, async (req, res) => {
    const { name, phone, address, comments } = req.body;
    const newProduct = {
        name, 
        phone,
        address, 
        comments,
        user_id: req.user.id,
    };
    console.log(req.user.id);
    await pool.query("INSERT INTO providers set ?", [newProduct]);
    req.flash("success", "Proveedor guardado correctamente");
    res.redirect("/providers/add");
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { name, phone, address, comments } = req.body;
    const newProvider = {
        name, 
        phone,
        address, 
        comments,
    };
    console.log(req.body);
    await pool.query("UPDATE providers set ? WHERE ID = ?", [newProvider, id]);
    req.flash("success", "Proveedor actualizado correctamente");
    res.redirect("/providers/search");
});

router.post("/search", isLoggedIn, async (req, res) => {
    const { name } = req.body;
    const providers = await pool.query("SELECT * FROM providers WHERE name = ? AND user_id = ?", [name, req.user.id]);
    if( providers.length == 0 ) {
        req.flash("message", "Proveedor no encontrado");
        res.redirect("/providers/search");
    } else {
        console.log(providers);
        res.render("providers/search", { providers });
    }
});

module.exports = router;