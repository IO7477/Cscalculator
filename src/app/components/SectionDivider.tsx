interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="px-4 py-4 mt-2">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
        {label}
      </h2>
    </div>
  );
}