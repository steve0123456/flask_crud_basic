from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/expense/*": {"origins": "*"}})  # Allow Next.js to access API

expenses = []

@app.route("/")
def home():
    return "Expense Tracker API is running!"

# ✅ GET all expenses
@app.route("/expense", methods=["GET"])
def get_expenses():
    return jsonify(expenses), 200

# ✅ POST - Add a new expense
@app.route("/expense", methods=["POST"])
def add_expense():
    try:
        data = request.get_json()
        if not data or "name" not in data or "amount" not in data or "quantity" not in data:
            return jsonify({"error": "Missing required fields (name, amount, quantity)"}), 400
        
        expense = {
            "id": len(expenses) + 1,
            "name": data["name"],
            "amount": float(data["amount"]),  # Ensure amount is stored as a number
            "quantity": int(data["quantity"])  # Ensure quantity is stored as an integer
        }
        
        expenses.append(expense)
        return jsonify({"message": "Expense added successfully", "expense": expense}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ PUT - Update an expense
@app.route("/expense/<int:expense_id>", methods=["PUT"])
def update_expense_by_id(expense_id):
    data = request.get_json()

    for expense in expenses:
        if expense['id'] == expense_id:
            if "amount" in data:
                expense['amount'] = float(data['amount'])  # Ensure it's a float
            if "quantity" in data:
                expense['quantity'] = int(data['quantity'])  # Ensure it's an integer
            return jsonify({"message": "Expense updated successfully", "expense": expense}), 200
    
    return jsonify({"error": "Expense not found"}), 404

# ✅ DELETE - Remove an expense
@app.route("/expense/<int:expense_id>", methods=["DELETE"])
def delete_expense_by_id(expense_id):
    global expenses
    expenses = [expense for expense in expenses if expense["id"] != expense_id]

    return jsonify({"message": "Expense deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
