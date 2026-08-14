type Props = {
  className?: string;
  tone?: 'light' | 'dark';
};

/** Shared Student → Mentor style connector (line + arrow). */
export function FlowConnector({ className, tone = 'light' }: Props) {
  const classes = ['flow-connector', tone === 'dark' ? 'flow-connector--dark' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-hidden="true">
      <span className="flow-connector__track" />
    </span>
  );
}
