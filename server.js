const express = require('express');
const editionRoutes = require('./routes/edition.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/editions', editionRoutes);

app.get('/', (req, res) => {
    res.send('DTU Times Editions API is running!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});