import express from 'express';

import { login } from './auth';

const app = express();

app.use(express.json());
app.use('/api/login', login);

export { app };
