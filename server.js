require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Você usa { Pool } no seu código

const app = express();

// Middlewares - São essenciais para o Node.js receber os dados do seu site
app.use(cors()); // Permite que seu site front-end faça requisições
app.use(express.json()); // Permite que o Express leia o JSON do feedback

// ------------------------------------------
// CONEXÃO COM O BANCO
// ------------------------------------------
// ------------------------------------------
// CONEXÃO COM O BANCO
// ------------------------------------------
const pool = new Pool({
  user: 'postgres', // Seu usuário de BD
  host: 'localhost', // <-- FORÇA o IP numérico aqui!
  database: 'feedback', // Nome do seu banco de dados
  password: 'root', // Sua senha real do PostgreSQL
  port: 5432,
});
// (Remova o process.env.DATABASE_URL. Ou defina as variáveis no .env)

// ------------------------------------------
// ROTA PARA RECEBER O FEEDBACK (CORRIGIDA COM 'AVALIACAO')
// ------------------------------------------
app.post('/api/feedback', async (req, res) => {
    // A desestruturação continua a mesma (não recebemos 'data_envio' do frontend)
    const { nome, email, mensagem, avaliacao } = req.body; 

    const query = `
      -- 1. Inclua a nova coluna na lista de colunas
      INSERT INTO feedback (nome, email, mensagem, avaliacao, data_envio)
      
      -- 2. Insira o valor DEFAULT para data_envio
      VALUES ($1, $2, $3, $4, DEFAULT)
    `;
    // A lista de valores continua com 4 itens, pois o 5º é DEFAULT
    const values = [nome, email, mensagem, avaliacao]; 

    try {
        await pool.query(query, values);
        res.status(201).send({ message: 'Feedback salvo com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar feedback:', err);
        res.status(500).send({ message: 'Erro interno ao processar o feedback.' });
    }
});

// Iniciar o servidor na porta 4000
app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});
