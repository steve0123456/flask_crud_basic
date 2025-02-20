"use client";
import { useState, useEffect } from "react";
import "./ExpenseTracker.css"; // Import external CSS file

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", quantity: "" });
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch Expenses
  const getExpenses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/expense");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Add Expense
  const addExpense = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      if (res.ok) {
        setNewExpense({ name: "", amount: "", quantity: "" });
        getExpenses();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Update Expense
  const updateExpense = async () => {
    if (!editingExpense) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/expense/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExpense),
      });

      if (res.ok) {
        setEditingExpense(null);
        getExpenses();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/expense/${id}`, { method: "DELETE" });
      getExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newExpense.quantity}
          onChange={(e) => setNewExpense({ ...newExpense, quantity: e.target.value })}
        />
        <button className="add-btn" onClick={addExpense}>Add Expense</button>
      </div>

      {editingExpense && (
        <div className="edit-section">
          <h3>Editing Expense</h3>
          <input
            type="number"
            placeholder="Amount"
            value={editingExpense.amount}
            onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={editingExpense.quantity}
            onChange={(e) => setEditingExpense({ ...editingExpense, quantity: e.target.value })}
          />
          <button className="update-btn" onClick={updateExpense}>Update</button>
          <button className="cancel-btn" onClick={() => setEditingExpense(null)}>Cancel</button>
        </div>
      )}

      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <span>{expense.name} - ${expense.amount} x {expense.quantity}</span>
            <div>
              <button className="edit-btn" onClick={() => setEditingExpense(expense)}>✏️ Edit</button>
              <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>❌ Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
