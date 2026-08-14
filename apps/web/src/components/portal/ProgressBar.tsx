type Props = {
  percent: number;
  label?: string;
};

export function ProgressBar({ percent, label }: Props) {
  const safe = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="progress-bar" aria-label={label ?? `${safe}% complete`}>
      <span style={{ width: `${safe}%` }} />
    </div>
  );
}
