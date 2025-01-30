const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express')
const router = express.Router()
const calPrice = require('../utility/calprice')

//CRETE
router.post("/cart", async (req, res) => {
    try {
        const { productID, qty } = req.body;

        const findProduct = await prisma.product.findUnique({
            where: { id: productID }
        });

        if (!findProduct) {
            res.send({
                message: "Product not found"
            });
        }

        const findCart = await prisma.cart.findUnique({
            where: { id: productID }
        });

        if (findCart) {
            res.send({
                message: "Cart already exists"
            });
        }

        const total_price = productID.price * qty;

        await prisma.cart.create({
            data: {
                productID: {
                    connect: { id: productID }
                },
                qty,
                total_price
            }
        });
        res.status(201).json(cartItem);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})
//READ
router.get("/cart", async (req, res) => {
    try {
        const cart = await prisma.cart.findMany({
            include: {
                product: true
            }
        });
        res.json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})
//UPDATE
router.put("/cart/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { qty } = req.body;
        const findProduct = await prisma.cart.findUnique({
            where: { id: Number(id) },
            include: { product: true }
        });

        if (!findProduct) {
            res.send({
                message: "Cart item not found"
            });
        }

        if (qty <= 0) {
            await prisma.cart.delete({ where: { id: Number(id) } });
            return res.json({ message: "Cart item deleted" });
        }

        const totalPrice = findProduct.product.price * qty;

        const updateCart = await prisma.cart.update({
            where: { id: Number(id) },
            data: {
                qty: qty,
                total_price: totalPrice
            }
        })

        res.json(updateCart);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})
//DEL
router.delete("/cart/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const findProduct = await prisma.cart.findUnique({
            where: { id: Number(id) }
        });

        if (!findProduct) {
            res.send({
                message: "Cart item not found"
            });
        }

        await prisma.cart.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "Cart item deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})
//CAL
router.get("/cart/total", async (req, res) => {
    try {
        const total = await prisma.cart.findMany();

        const f = calPrice(total)

        console.log(f);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})

module.exports = router;