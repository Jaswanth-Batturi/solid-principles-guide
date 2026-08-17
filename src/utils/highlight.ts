import { codeToHtml } from 'shiki';

export async function highlightJava(code: string): Promise<string> {
  return codeToHtml(code.trim(), {
    lang: 'java',
    theme: 'github-dark',
  });
}
