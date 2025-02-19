"use client";
import { useState, useEffect } from "react";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", quantity: "" });
  const [editingExpense, setEditingExpense] = useState(null); // Store expense being edited

  // ✅ Fetch expenses from Flask API
  const getExpenses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/expense");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // ✅ Add a new expense
  const addExpense = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      if (res.ok) {
        setNewExpense({ name: "", amount: "", quantity: "" }); // Clear form
        getExpenses(); // Refresh list
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // ✅ Update an existing expense
  const updateExpense = async () => {
    if (!editingExpense) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/expense/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExpense),
      });

      if (res.ok) {
        setEditingExpense(null); // Clear editing state
        getExpenses(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // ✅ Delete an expense
  const deleteExpense = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/expense/${id}`, { method: "DELETE" });
      getExpenses(); // Refresh list
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // ✅ Load expenses on component mount
  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>

      {/* Input Fields for Adding */}
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
      <button onClick={addExpense}>Add Expense</button>

      {/* Input Fields for Updating */}
      {editingExpense && (
        <div>
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
          <button onClick={updateExpense}>Update Expense</button>
          <button onClick={() => setEditingExpense(null)}>Cancel</button>
        </div>
      )}

      {/* Display Expenses */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - ${expense.amount} x {expense.quantity}
            <button onClick={() => deleteExpense(expense.id)}>❌ Delete</button>
            <button onClick={() => setEditingExpense(expense)}>✏️ Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
