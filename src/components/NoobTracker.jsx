import React, { useState, useEffect } from "react";
import styles from "./Noobtracker.module.css";

const COLORS = ["#FF9304", "#FFBB28", "#A000FF"];

const RADIAN = Math.PI / 180;

const ModaladdExpense = ({ onClose, onAddExpense, editingExpense }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || "",
        price: editingExpense.amount || "", // `amount` is stored, but you're using `price` in the form
        category: editingExpense.category || "",
        date: editingExpense.date || "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      ...formData,
      amount: formData.price, // or parseFloat(formData.price)
    });
    setFormData({ title: "", price: "", category: "", date: "" });
    onClose(); // optionally close the modal after submit
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/75 z-10">
      <div className="absolute inset-0 bg-black/25 -z-10" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md max-w-md w-full"
      >
        <h1 className="text-center text-2xl font-bold">Add Expense</h1>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-4"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-4"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-4"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-4"
        />

        <div className="flex justify-between mt-4 items-center gap-4">
          <button
            type="submit"
            className="p-2 px-4 bg-green-300 text-green-800 rounded-full"
          >
            Add Expense
          </button>
          <button
            type="button"
            className="p-2 px-4 bg-red-300 text-red-800 rounded-full"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Modaladdbalance = ({ onClose, onAddIncome }) => {
  const [incomeAmount, setIncomeAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddIncome(incomeAmount);
    setIncomeAmount("");
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/75 z-10">
      {/* fullscreen overlay to close the model on clcking outside */}
      <div className="absolute inset-0 bg-black/25 -z-10" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md max-w-md w-full"
      >
        <h1 className="text-center text-2xl font-bold">Add Balance</h1>
        <input
          type="number"
          name="amount"
          placeholder="Income Amount"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-4"
        />
        <div className="flex justify-between mt-4 items-center gap-4">
          <button
            type="submit"
            className="p-2 px-4 bg-green-300 text-geen-800 rounded-full"
          >
            Add Balance
          </button>
          <button
            type="button"
            className="p-2 px-4 bg-red-300 text-red-800 rounded-full"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ExpenseApp = () => {
  const [open, setOpen] = useState(false);
  const [balance, setbalance] = useState(false);
  const [walletBalance, setWalletBalance] = useState(
    //default 5000 set
    localStorage.getItem("walletBalance") || 5000
  );
  const [expenses, setExpenses] = useState(
    // default empty
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance);
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const getChartDataFromExpenses = (expenses) => {
    const dataMap = {};

    expenses.forEach((expense) => {
      dataMap[expense.category] =
        (dataMap[expense.category] || 0) + parseFloat(expense.amount);
    });
    const colors = ["#FF9304", "#A000FF", "#FDE006"];

    return Object.entries(dataMap).map(([category, value], index) => ({
      category,
      value,
      fill: colors[index % colors.length], // Dynamic color for each category
    }));
  };

  const chartData = getChartDataFromExpenses(expenses);

  const handleAddExpense = (newExpense) => {
    if (
      !newExpense.title ||
      !newExpense.amount ||
      !newExpense.category ||
      !newExpense.date
    ) {
      alert("Please fill all fields");
      return;
    }

    const amountNum = Number(newExpense.amount);

    if (editingExpense) {
      const original = expenses.find((exp) => exp.id === editingExpense.id);
      const originalAmount = Number(original.amount);

      // Calculate difference and adjust wallet
      const difference = amountNum - originalAmount;

      if (walletBalance < difference) {
        alert("Not enough balance to update this expense!");
        return;
      }

      const updatedExpenses = expenses.map((exp) =>
        exp.id === editingExpense.id
          ? { ...newExpense, id: editingExpense.id }
          : exp
      );
      setExpenses(updatedExpenses);
      setWalletBalance((prev) => prev - difference);
      setEditingExpense(null);
    } else {
      if (amountNum > walletBalance) {
        alert("Not enough balance in wallet!");
        return;
      }

      const expenseWithId = { ...newExpense, id: Date.now() };
      setExpenses((prev) => [...prev, expenseWithId]);
      setWalletBalance((prev) => prev - amountNum);
    }

    setOpen(false);
  };

  const handleAddIncome = (incomeAmount) => {
    const parsed = parseFloat(incomeAmount);

    if (!parsed || isNaN(parsed)) {
      // if not a number
      alert("Please enter a valid amount");
      return;
    }

    setWalletBalance((prev) => {
      const prevNum = parseFloat(prev); // parsefloat so that it is converted to string
      return prevNum + parsed; //add
    });

    setbalance(false);
  };
  const totalExpenses = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  ); // add the spent amt n use number() to actuall add

  const barChartData = expenses.map((exp, index) => ({
    name: `${exp.title}-${index}`, // Ensure uniqueness with index
    value: parseFloat(exp.amount),
  }));

  const handleDelete = (idToDelete) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== idToDelete);

    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    setExpenses(updatedExpenses);
  };

  console.log("first", expenses);
  return (
    <div className={styles.box1}>
      <h1 className={styles.h1tag}>Expense Tracker</h1>
      <div className={styles.box2}>
        <section className={styles.wallet}>
          <h3 className={styles.walletBalance}>
            Wallet Balance: ₹{walletBalance}
          </h3>

          <div></div>
          <button
            style={{ color: "white" }}
            type="button"
            className={styles.btn1}
            onClick={() => setbalance(true)}
          >
            + Add Income
          </button>

          {balance && (
            <Modaladdbalance
              balance={balance}
              onClose={() => setbalance(false)}
              onAddIncome={handleAddIncome}
            />
          )}
        </section>
        <section className={styles.expense}>
          <h3 className={styles.expensebox}>Expenses: ₹{totalExpenses} </h3>
          <button
            style={{ color: "white" }}
            type="button"
            className={styles.btn2}
            onClick={() => setOpen(true)}
          >
            + Add Expense
          </button>
          {open && (
            <ModaladdExpense
              onClose={() => setOpen(false)}
              onAddExpense={handleAddExpense}
              editingExpense={editingExpense}
            />
          )}
        </section>
      </div>

      <div className={styles.bottom}>
        <section>
          <h3 className={styles.transactionh3}>Recent Transactions</h3>
          <div className={styles.trnx}>
            {expenses.map((exp, index) => (
              <div key={index} className={styles.trnxItem}>
                <h3
                  style={{
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
                    fontSize: "20px",
                    color: "black",
                  }}
                >
                  {exp.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    color: "gray",
                    borderBottom: "1px solid gray",
                    width: "95%",
                  }}
                >
                  <p>
                    {new Date(exp.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </p>

                  <p style={{ marginLeft: "500px", paddingRight: "5px" }}>
                    ₹{exp.amount}
                  </p>
                  <button
                    className="p-1 hover:bg-green-50 cursor-pointer rounded-full"
                    onClick={() => {
                      setEditingExpense(exp);
                      setOpen(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 hover:bg-red-50 cursor-pointer rounded-full"
                    onClick={() => handleDelete(exp.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="red"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3 className={styles.expenseh3}>Top Expenses</h3>
        </section>
      </div>
    </div>
  );
};

export default ExpenseApp;
