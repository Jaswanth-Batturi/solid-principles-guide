/**
 * Client-side mirror of java-files.ts for dynamic runner updates.
 */
export function javaToCompilerFiles(code: string): Array<{ name: string; content: string }> {
  const trimmed = code.trim();
  if (!trimmed) {
    return [
      {
        name: 'Main.java',
        content: `public class Main {
    public static void main(String[] args) {
        System.out.println("Paste code from Problem or Fixed tab above");
    }
}`,
      },
    ];
  }

  const publicClass = trimmed.match(/^public\s+class\s+(\w+)/m);
  const name = publicClass ? `${publicClass[1]}.java` : 'Main.java';
  return [{ name, content: trimmed }];
}

export function hasRunnableMain(code: string): boolean {
  return /public\s+static\s+void\s+main\s*\(/m.test(code);
}
