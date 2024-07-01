const express = require('express');
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

const app = express();
const router = require("./routers/api_Router");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', router);
app.use('/api', router);


const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Обработка 404 ошибки
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
``