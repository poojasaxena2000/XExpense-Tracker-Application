import { useState, useEffect, useMemo } from "react";
import Summary from "./Summary";
import ExpenseList from "./Expenses";
import TopExpenses from "./TopExpenses";
import TransactionModal from "./TransactionModel";

export default function ExpenseTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [expenses, setExpenses] = useState([]);

  // Initialize expenses from localStorage
  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses"));
    if (storedExpenses) {
      setExpenses(storedExpenses);
    }
  }, []);

  // Update localStorage whenever expenses change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  // const totalIncome = expenses
  //   .filter((expense) => expense.type === "income")
  //   .reduce((total, expense) => total + expense.amount, 0);

  // Default total income is set to 5000
  const totalIncome = useMemo(() => {
    const incomeFromExpenses = expenses
      .filter((expense) => expense.type === "income")
      .reduce((total, expense) => total + expense.amount, 0);
    return 5000 + incomeFromExpenses; // Default income + any additional income from transactions
  }, [expenses]);

  const totalExpenses = expenses
    .filter((expense) => expense.type === "expense")
    .reduce((total, expense) => total + expense.amount, 0);

  // const topExpenses = expenses
  //   .filter((expense) => expense.type === "expense")
  //   .sort((a, b) => b.amount - a.amount)
  //   .slice(0, 5);

  // Group expenses by category and sum amounts
  const groupedExpenses = useMemo(() => {
    return expenses
      .filter((expense) => expense.type === "expense") // Filter only expenses
      .reduce((acc, expense) => {
        const { category, amount } = expense;
        if (!acc[category]) {
          acc[category] = { category, amount: 0 };
        }
        acc[category].amount += amount; // Aggregate amounts for each category
        return acc;
      }, {});
  }, [expenses]);

  // Get the top 5 expenses by amount
  const topExpenses = useMemo(() => {
    const sortedExpenses = Object.values(groupedExpenses)
      .sort((a, b) => b.amount - a.amount) // Sort by the total amount of each category
      .slice(0, 5); // Get the top 5
    return sortedExpenses;
  }, [groupedExpenses]);

  const recentTransactions = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const openAddModal = (type) => {
    setTransactionType(type);
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setTransactionType(transaction.type);
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleTransactionSubmit = (transaction) => {
    if (editingTransaction) {
      updateExpense({ ...transaction, id: editingTransaction.id });
    } else {
      addExpense(transaction);
    }
    closeModal();
  };

  const incomePercentage =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const expensesPercentage =
    totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Summary
          title="Wallet Balance:"
          amount={totalIncome}
          type="Income"
          onAddClick={() => openAddModal("income")}
        />
        <Summary
          title="Expenses:"
          amount={totalExpenses}
          type="Expense"
          onAddClick={() => openAddModal("expense")}
        />

        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <h3 className="text-sm font-medium text-gray-600">Overview</h3>
          <div className="relative text-black p-2 rounded-lg overflow-hidden border border-gray-300">
            <div
              className="h-full absolute bg-green-200 inset-0"
              style={{ width: `${incomePercentage}%` }}
            />
            <div className="relative">
              <p className="text-sm text-gray-700 font-semibold tracking-wide">
                Income
              </p>
            </div>
          </div>
          <div className="relative text-black p-2 rounded-lg overflow-hidden border border-gray-300">
            <div
              className="h-full absolute bg-rose-200 inset-0"
              style={{ width: `${expensesPercentage}%` }}
            />
            <div className="relative">
              <p className="text-sm text-gray-700 font-semibold tracking-wide">
                Expenses
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ExpenseList
          expenses={recentTransactions}
          onDeleteExpense={deleteExpense}
          onEditExpense={openEditModal}
        />
        <TopExpenses totalExpenses={totalExpenses} expenses={topExpenses} />
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleTransactionSubmit}
          defaultType={transactionType}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
}
