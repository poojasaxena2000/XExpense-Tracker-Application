export default function TopExpenses({ totalExpenses, expenses }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Top Expenses</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No expenses yet</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense, index) => {
            // Calculate percentage of total expenses
            const percentage = Math.round(
              (expense.amount / totalExpenses) * 100
            );

            return (
              <div
                key={expense.id}
                className="relative border border-gray-200 p-4 rounded-lg overflow-hidden"
              >
                <div
                  className="h-full absolute bg-rose-200 inset-0"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex items-center justify-between mt-1 tracking-wide">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-red-700 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        {expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-rose-600">
                      - &#8377;{expense.amount}
                    </span>
                    <span className="text-xs text-gray-500">{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
