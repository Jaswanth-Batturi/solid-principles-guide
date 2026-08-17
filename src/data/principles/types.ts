export type PrincipleLetter = 's' | 'o' | 'l' | 'i' | 'd';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Principle {
  slug: string;
  name: string;
  letter: PrincipleLetter;
  /** One sentence: what this principle means in practice. */
  oneLiner: string;
  /** Full analogy paragraph. */
  analogy: string;
  analogyIcon: string;
  /** Optional: 3 short steps for the pictorial scene (daily life). */
  sceneSteps?: string[];
  problem: string;
  solution: string;
  /** Plain-language pains when you violate the principle. */
  withoutPrinciplePains?: string[];
  /** Plain-language wins when you follow the principle. */
  withPrincipleWins?: string[];
  /** What to look for when comparing the two code blocks. */
  codeTakeaway?: string;
  whenToUse: string[];
  whenNotToUse: string[];
  relatedPrinciples: string[];
  codeBefore: string;
  codeAfter: string;
  /** Short runnable demo — clearer than full codeAfter for the exercise. */
  runDemo?: string;
  /** Steps for the Java exercise section. */
  tryItSteps?: string[];
  quiz: QuizQuestion[];
}

export const letterLabels: Record<PrincipleLetter, string> = {
  s: 'S — Single Responsibility',
  o: 'O — Open/Closed',
  l: 'L — Liskov Substitution',
  i: 'I — Interface Segregation',
  d: 'D — Dependency Inversion',
};

export const letterHints: Record<PrincipleLetter, string> = {
  s: 'One class, one reason to change',
  o: 'Open for extension, closed for modification',
  l: 'Subtypes must be substitutable',
  i: 'Small, focused interfaces',
  d: 'Depend on abstractions, not concretions',
};

