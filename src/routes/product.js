const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express')
const router = express.Router()

//CREATE
router.post("/product", async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price || price == 0 || isNaN(price)) {
            return res.status(400).send("Invalid data");
        }

        const product = await prisma.product.create({
            data: {
                name,
                price
            }
        })
        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

//READ
//Find id
router.get("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

//Find all
router.get("/product", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    try {

        const [products, totalProducts] = await prisma.$transaction([
            prisma.product.findMany({
                skip: skip,
                take: pageSize,
            }),
            prisma.product.count()
        ])

        res.send({
            page,
            pageSize,
            products,
            totalProducts
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

//UPDATE
router.put("/product/:id", async (req, res) => {
    try {
        const { name, price } = req.body;
        const { id } = req.params;

        if (!name || !price || price == 0 || isNaN(price)) {
            return res.status(400).send("Invalid data");
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name,
                price: price,
            },
        });

        res.json({
            message: "Product updated successfully",
            updatedProduct: updatedProduct,
        });

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});



//DELETE
router.delete("/product/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;