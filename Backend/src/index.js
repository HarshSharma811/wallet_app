const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Users CRUD
app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  const user = await prisma.user.create({ data: { username, email } });
  res.json(user);
});

app.get('/users', async (req, res) => {
  const { sortBy, filter } = req.query;
  let usersQuery = prisma.user.findMany();

  if (filter) {
    usersQuery = prisma.user.findMany({
      where: {
        username: { contains: filter, mode: 'insensitive' },
      },
    });
  }

  if (sortBy) {
    usersQuery = prisma.user.findMany({
      orderBy: { [sortBy]: 'asc' },
    });
  }

  const users = await usersQuery;
  res.json(users);
});

// Wallet CRUD
app.post('/wallets', async (req, res) => {
  const { userId, balance } = req.body;
  const wallet = await prisma.wallet.create({ data: { userId, balance } });
  res.json(wallet);
});

app.get('/wallets/:id', async (req, res) => {
  const wallet = await prisma.wallet.findUnique({ where: { id: req.params.id } });
  res.json(wallet);
});

// Transactions CRUD
app.post('/transactions', async (req, res) => {
  const { walletId, type, amount, category } = req.body;
  const transaction = await prisma.transaction.create({
    data: { walletId, type, amount, category },
  });
  res.json(transaction);
});

app.get('/transactions/:walletId', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { walletId: req.params.walletId },
  });
  res.json(transactions);
});

app.listen(3001, () => console.log('Backend running on http://localhost:3306'));
