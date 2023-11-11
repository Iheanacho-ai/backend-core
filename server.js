const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const port = process.env.PORT;
const routes = require('./routes/index');
const db = require('./models')

app.use(express.json());
app.use(cors());
app.use('/api', routes);
app.use(express.urlencoded({extended: true}));

(async () => {
    await db.sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
})();

app.listen(port, () => {
    console.log(`app is listening on port: ${port}`)
})
