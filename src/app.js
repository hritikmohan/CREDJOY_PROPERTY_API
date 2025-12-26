import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/error.middleware.js'; // Note .js
import propertyRoutes from './routes/property.routes.js'; // Note .js

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/properties', propertyRoutes);

app.use(errorHandler);

export default app;