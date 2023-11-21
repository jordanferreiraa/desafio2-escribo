const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Simulando um armazenamento em memória
const users = [];

// Endpoint de cadastro (sign up)
app.post('/signup', (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  // Verifica se o usuário já existe
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'E-mail já existente' });
  }

  // Cria um novo usuário
  const newUser = { nome, email, senha, telefone };
  users.push(newUser);

  return res.status(201).json(newUser);
});

// Endpoint de autenticação (sign in)
app.post('/signin', (req, res) => {
  const { email, senha } = req.body;

  // Verifica se o usuário existe
  const user = users.find(user => user.email === email);

  if (!user || user.senha !== senha) {
    return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
  }

  return res.json({ message: 'Autenticação bem-sucedida' });
});

// Endpoint de recuperação de informações do usuário
app.get('/user/:email', (req, res) => {
  const { email } = req.params;

  // Verifica se o usuário existe
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Não autorizado' });
  }

  return res.json(user);
});

// Tratamento de endpoint não encontrado
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
