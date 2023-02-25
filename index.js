require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.post('/pay', async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) return res.status(400).json({ message: 'Please Enter A Name' })
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(9 * 100),
            currency: 'INR',
            payment_method_types: ["card", "wallet"],
            metadata: {name}
        })
        const clientSecret = paymentIntent.client_secret;
        res.json({ message: "Payment Intiated", clientSecret})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.listen(PORT, () => console.log('Server Working'))
