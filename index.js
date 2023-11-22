const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Senha utilizada para assinatura digital
const SECRET = 'jotaefe';

// Simulando um armazenamento em memória
const users = [];

// Função para obter a data atual em formato string
const getCurrentDateTime = () => new Date().toISOString();

// Endpoint de cadastro (sign up)
app.post('/signup', (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  // Verifica se o usuário já existe
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'E-mail já existente' });
  }

  // Token JWT
  const chave = jwt.sign({id: uuidv4()}, SECRET, { expiresIn: 1800 });

  // Cria um novo usuário
  const newUser = {
    id: uuidv4(),
    nome,
    email,
    senha,
    telefone,
    data_criacao: getCurrentDateTime(),
    data_atualizacao: getCurrentDateTime(),
    ultimo_login: null, // Definido como nulo inicialmente
    token: chave
  };

  users.push(newUser);

  return res.status(201).json({
    id: newUser.id,
    data_criacao: newUser.data_criacao,
    data_atualizacao: newUser.data_atualizacao,
    ultimo_login: newUser.ultimo_login,
    token: newUser.token,
  });
});

// Endpoint de autenticação (sign in)
app.post('/signin', (req, res) => {
  const { email, senha } = req.body;

  // Verifica se o usuário existe
  const user = users.find(user => user.email === email);

  if (!user || user.senha !== senha) {
    return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
  }

  // Atualiza a última data de login
  user.ultimo_login = getCurrentDateTime();

  return res.json({
    id: user.id,
    data_criacao: user.data_criacao,
    data_atuzalizacao: user.data_atuzalizacao,
    ultimo_login: user.ultimo_login,
    token: user.token
  });
});

// Endpoint de recuperação de informações do usuário
app.get('/user/:email', (req, res) => {
  const { email } = req.params;
  const token = req.headers.authorization; // Pega o token do cabeçalho

  // Verifica se o usuário existe
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Não autorizadooo' });
  }

  // Verifica se o token no cabeçalho é válido
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    // if (decoded.id !== user.id) {
    //   return res.status(401).json({ error: 'Não autorizado', decoded: decoded.id, user: user.id });
    // }

    return res.json(user);
  });
});

// Tratamento de endpoint não encontrado
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
