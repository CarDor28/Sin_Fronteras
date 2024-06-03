const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = [];

app.use(bodyParser.json());
app.use(cors());

app.post('/saveRoute', (req, res) => {
    const { start, end } = req.body;
    routes.push({ start, end });
    res.status(200).send({ message: 'Ruta guardada correctamente' });
});

app.get('/getRoutes', (req, res) => {
    res.status(200).send(routes);
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});