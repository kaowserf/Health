// Per-session accent colors, assigned by index so each session date is
// instantly recognizable across the chart and the cards.
export const SESSION_COLORS = ["#5ebc2c", "#2563eb", "#f59e0b", "#a855f7"];

export function colorFor(index: number): string {
  return SESSION_COLORS[index % SESSION_COLORS.length];
}
