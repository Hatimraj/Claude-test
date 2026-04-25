type Item = { id: string; label: string };

export function ModelSelector({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Item[];
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
