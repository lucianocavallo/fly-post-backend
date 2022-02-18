import express from 'express';
import cors from 'cors';

import auth, { login } from './auth';
import errorHandler from './middleware/error.handler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(auth);
app.use('/api/login', login);
// app.use('/test', (req, res, next) => {
//   try {
//     // @ts-ignore
//     console.log('req.user: ', req.user.id);

//     // @ts-ignore
//     res.json({ user_id: req.user.id });
//   } catch (error) {
//     next({ message: 'unauthorized' });
//   }
// });
app.use(errorHandler);

export { app };
