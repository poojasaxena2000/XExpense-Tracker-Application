import { useEffect, useState } from "react";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Personal Care",
  "Travel",
  "Debt",
  "Gifts",
  "Bills",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Dividends",
  "Rental",
  "Gifts",
  "Refunds",
  "Other",
];

export default function TransactionModel({
  isOpen,
  onClose,
  onSubmit,
  defaultType,
  transaction,
}) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: defaultType,
  });

  // Update form when editing an existing transaction
  useEffect(() => {
    console.log(transaction);
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
      });
    } else {
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: defaultType,
      });
    }
  }, [transaction, defaultType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newName = name === "price" ? "amount" : name === "amount" ? "amount" : name;
    setFormData((prev) => ({ ...prev, [newName]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.category) {
      return;
    }

    onSubmit({
      title: formData.title,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      type: formData.type,
    });
  };

  if (!isOpen) return null;

  const isEditing = !!transaction;
  const categories =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const inputClass =
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <div className="flex justify-between items-center px-6 p-4 border-b border-gray-300">
          <h2 className="text-lg font-medium text-gray-800">
            {isEditing ? "Edit" : "Add"}{" "}
            {formData.type === "income" ? "Income" : "Expense"}
          </h2>
          <button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              title
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What was this transaction for?"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <input
              id="amount"
              name={formData.type === "income" ? "amount" : "price"}
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder={formData.type === "income" ? "Income Amount" : "price"}
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="h-10 text-sm px-6 p-2 bg-gray-200 rounded cursor-pointer active:scale-95"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                formData.type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              } h-10 px-4 py-2 text-sm active:scale-95 rounded cursor-pointer`}
            >
              {isEditing ? "Update" : "Add"}{" "}
              {formData.type === "income" ? "Income" : "Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
