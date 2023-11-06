import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
