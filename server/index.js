require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body;

    const cust = {
        customerName: "Jayne Rowe IV",
        line1: "561 Schoen Radial",
        city: "Lake Mateo",
        state: "Florida",
        country: "Austria",
    };

    // Create a customer object with the customer's name and address
    const customer = await stripe.customers.create({
        name: cust.customerName,
        address: {
            line1: cust.line1,
            city: cust.city,
            state: cust.state,
            country: cust.country,
        },
    });

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.dish,
                images: [product.imgdata]
            },
            unit_amount: product.price * 100,
        },
        quantity: product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
        customer: customer.id,

        payment_intent_data: {
            setup_future_usage: 'off_session',
        },
    });

    res.json({ id: session.id })
});

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(4000, () => {
    console.log("server start on PORT 4000")
});
