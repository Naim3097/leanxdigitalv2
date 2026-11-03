const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export const countWord = (n: number) => words[n] ?? String(n);

export const listOf = (items: readonly string[]) =>
  new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }).format(items);

/** Lowercase the first letter only, so names like "CRM" and "Google" survive mid-sentence. */
export const lcFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
