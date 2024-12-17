import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList } from 'react-native';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ type: '', amount: '', category: '' });

  useEffect(() => {
    // Fetch balance and transactions on load
    fetch('http://localhost:3001/wallets/1') // Replace with dynamic wallet ID
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));

    fetch('http://localhost:3001/transactions/1') // Replace with dynamic wallet ID
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const addTransaction = () => {
    fetch('http://localhost:3001/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletId: '1', ...newTransaction }),
    })
      .then(() => {
        setTransactions([...transactions, newTransaction]);
        setNewTransaction({ type: '', amount: '', category: '' });
      });
  };

  return (
    <SafeAreaView>
      <Text>Balance: {balance}</Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <Text>{`${item.type} - ${item.amount} - ${item.category}`}</Text>
        )}
      />

      <TextInput
        placeholder="Type (send/receive)"
        value={newTransaction.type}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, type: text })}
      />
      <TextInput
        placeholder="Amount"
        value={newTransaction.amount}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
      />
      <TextInput
        placeholder="Category"
        value={newTransaction.category}
        onChangeText={(text) => setNewTransaction({ ...newTransaction, category: text })}
      />
      <Button title="Add Transaction" onPress={addTransaction} />
    </SafeAreaView>
  );
};

export default App;
