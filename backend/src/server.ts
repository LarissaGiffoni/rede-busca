import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';

const app = express();

// Permite que o frontend acesse o backend
app.use(cors());
// Permite que o backend entenda JSON
app.use(express.json());

app.use('/api/auth', authRoutes);

// Rota de teste (Health Check)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend do Rede Busca está rodando!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});