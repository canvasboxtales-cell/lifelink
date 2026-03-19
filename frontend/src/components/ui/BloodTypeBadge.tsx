import type { BloodType } from '../../types';

const bloodTypeColors: Record<BloodType, string> = {
  'A+': 'bg-red-500',
  'A-': 'bg-red-700',
  'B+': 'bg-blue-500',
  'B-': 'bg-blue-700',
  'AB+': 'bg-purple-500',
  'AB-': 'bg-purple-700',
  'O+': 'bg-green-500',
  'O-': 'bg-green-700',
};

export default function BloodTypeBadge({ type, size = 'sm' }: { type: BloodType; size?: 'sm' | 'md' }) {
  return (
    <span className={`${bloodTypeColors[type]} text-white rounded-full font-bold inline-block ${size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}>
      {type}
    </span>
  );
}
