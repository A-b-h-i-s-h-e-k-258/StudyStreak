
export const StatsCards = () => {
  const stats = [
    { label: 'Total Completions', value: '0', color: 'text-blue-400' },
    { label: 'Avg Completion', value: '0%', color: 'text-emerald-400' },
    { label: 'Best Streak', value: '0', color: 'text-purple-400' },
    { label: 'Active Tasks', value: '5', color: 'text-orange-400' },
    { label: 'Days in Month', value: '31', color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
