import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
dotenv.config();
import routes from './routes/routes.js'

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://imagingai.onrender.com/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
})); // Use cors middleware to enable CORS
// console.log(process.env.PORT)

app.use('/', routes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}.`)
})

// gives idea of api request being called.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}) 