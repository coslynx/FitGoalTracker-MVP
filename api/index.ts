import express, { Request, Response, NextFunction } from 'express';
import authRouter from './routes/auth';
import goalsRouter from './routes/goals';
import { db } from './database';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/goals', goalsRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db.query('SELECT NOW()').then(result => console.log('Database connection successful:',result));
}).on('error', (err) => {
    console.error(`Failed to start server on port ${port}:`, err);
    process.exit(1);
});

```