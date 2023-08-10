import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import routes from './routes/routes.js'

const app = express();

app.use('/', routes)

// console.log(process.env.PORT)
app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}.`)
})

// gives idea of api request being called.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}) 