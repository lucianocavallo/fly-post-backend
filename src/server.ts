import express from 'express';
import cors from 'cors';

import { login } from './auth';

const app = express();

app.use(cors);
app.use(express.json());
app.use('/api/login', login);

export { app };
