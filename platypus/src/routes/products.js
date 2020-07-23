const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/", isLoggedIn, async (req, res) => {
    res.render("products/search");
});

router.get("/add", isLoggedIn, (req, res) => {
    res.render("products/add");
});

router.get("/search", isLoggedIn, async (req, res) => {
    res.render("products/search");
});

router.get("/search-all", isLoggedIn, async (req, res) => {
    var products = await pool.query("SELECT * FROM products WHERE user_id = ? ORDER BY name", [req.user.id]);
    if(products.length != 0) {
        res.render("products/search", { products });
    }else {
        req.flash("message", "Lista de articulos vacia");
        res.redirect("/products/search");
    }
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const products = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    res.render("products/edit", {product : products[0]});
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE ID = ?", [id]);
    req.flash("success", "Articulo removido correctamente");
    res.redirect("/products/search");
});

router.post("/add", isLoggedIn, async (req, res) => {
    const { name, brand, quantity, type } = req.body;
    const newProduct = {
        name, 
        brand,
        quantity, 
        type,
        user_id: req.user.id,
    };
    console.log(req.user.id);
    await pool.query("INSERT INTO products set ?", [newProduct]);
    req.flash("success", "Articulo guardado correctamente");
    res.redirect("/products/add");
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { name, brand, quantity, type } = req.body;
    const newProduct = {
        name, 
        brand,
        quantity, 
        type
    };
    console.log(req.body);
    await pool.query("UPDATE products set ? WHERE ID = ?", [newProduct, id]);
    req.flash("success", "Articulo actualizado correctamente");
    res.redirect("/products/search");
});

router.post("/search", isLoggedIn, async (req, res) => {
    const { name } = req.body;
    const products = await pool.query("SELECT * FROM products WHERE name = ? AND user_id = ?", [name, req.user.id]);
    if( products.length == 0 ) {
        req.flash("message", "Articulo no encontrado");
        res.redirect("/products/search");
    } else {
        console.log(products);
        res.render("products/search", { products });
    }
});

module.exports = router;