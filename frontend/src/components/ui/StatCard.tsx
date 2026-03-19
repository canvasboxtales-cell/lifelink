import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  change?: string;
  changeColor?: string;
  icon: ReactNode;
  iconBg?: string;
}

export default function StatCard({ title, value, change, changeColor = 'text-green-600', icon, iconBg = 'bg-blue-50' }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>}
      </div>
      <div className={`${iconBg} p-2 rounded-lg`}>{icon}</div>
    </div>
  );
}
