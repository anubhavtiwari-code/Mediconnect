export default function EmptyState({ title = "No items", subtitle = "", action }) {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
