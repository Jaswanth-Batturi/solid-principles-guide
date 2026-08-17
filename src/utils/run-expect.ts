/** Build a human-readable expect line from println calls in demo Java. */
export function deriveRunExpect(code: string): string {
  const parts: string[] = [];
  const stringLiteral = /System\.out\.println\("([^"]*)"\)/g;
  let m;
  while ((m = stringLiteral.exec(code)) !== null) {
    parts.push(m[1]);
  }

  const withConcat = /System\.out\.println\("([^"]*)"\s*\+/g;
  while ((m = withConcat.exec(code)) !== null) {
    parts.push(m[1].trim());
  }

  if (parts.length === 0 && /System\.out\.println/.test(code)) {
    return 'Lines printed in the editor console';
  }
  if (parts.length === 0) return 'Check the console output';
  if (parts.length <= 3) return parts.join(' · ');
  return `${parts.slice(0, 3).join(' · ')} (+${parts.length - 3} more)`;
}
