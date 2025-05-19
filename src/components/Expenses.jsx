export default function ExpenseList({
  expenses,
  onDeleteExpense,
  onEditExpense,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Recent Transactions
      </h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No transactions yet</p>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-snap">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-md border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {expense.title}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="truncate">{expense.category}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-medium ${
                    expense.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {expense.type === "income" ? "+" : "-"} &#8377;
                  {expense.amount}
                </span>

                <button
                  className="p-1 hover:bg-green-50 cursor-pointer rounded-full"
                  onClick={() => onEditExpense(expense)}
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
                  onClick={() => onDeleteExpense(expense.id)}
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
      )}
    </div>
  );
}
