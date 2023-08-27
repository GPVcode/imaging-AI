import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/routes.js';
import authRoutes from './routes/authRoutes.js';



const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB.');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
})

// gives idea of api request being called.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}) 

// Use authentication routes
app.use('/auth', authRoutes);

// Use main application routes
app.use('/', routes);


app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}.`)
})

