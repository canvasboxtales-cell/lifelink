export default function LoadingSpinner({ size = 8 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center p-8">
      <div className={`w-${size} h-${size} border-4 border-red-200 border-t-red-600 rounded-full animate-spin`} />
    </div>
  );
}
