const express = require('express');
const morgan = require('morgan');
// const bodyParser = require('body-parser');
const CONFIG = require('./config');
const fs = require('fs');

const stripe = require('stripe')(CONFIG.SECRET)

const app = express();
const PORT = process.env.PROCESS || 5000;
app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(express.static('public'));

// console.log(CONFIG)


app.get('/store', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if (error) {
            res.status(500).end();
        } else {
            res.render('store.ejs', {
                stripePublicKey: CONFIG.PUBLISH,
                items: JSON.parse(data)
            });
        }

    });
});


app.post('/purchase', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if (error) {
            res.status(500).end();
        } else {
            const itemsJson = JSON.parse(data);
            console.log(itemsJson)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.forEach(item => {
                const itemJson = itemsArray.find(i => i.id === Number(item.id))
                total = total + itemJson.price * item.quantity
            })

            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(() => {
                console.log('Charge Successful')
                res.json({ message: 'Successfully purchased items' })
            }).catch(() => {
                console.log('Charge Failed')
                res.status(500).end()
            })
        }

    });
});




app.listen(PORT, () => 
    console.log(`Server is listening on PORT ${PORT}`)
);