require('dotenv').config();
const { Pool } = require('pg');

// Conexão com o banco usando sua variável de ambiente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testarInsercao() {
  try {
    // Teste de inserção
    const query = `
      INSERT INTO feedback (nome, email, mensagem, nota)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = ['Jucier Teste', 'teste@teste.com', 'Mensagem de teste', 5];

    const result = await pool.query(query, values);

    console.log('✅ Inserção realizada com sucesso:');
    console.log(result.rows[0]);

    // Teste de leitura
    const leitura = await pool.query('SELECT * FROM feedback ORDER BY id DESC LIMIT 5');
    console.log('📄 Últimos registros:');
    console.log(leitura.rows);

  } catch (err) {
    console.error('❌ Erro ao testar banco:', err);
  } finally {
    pool.end();
  }
}

testarInsercao();
