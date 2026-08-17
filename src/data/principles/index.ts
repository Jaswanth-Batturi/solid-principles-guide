import { principles as principlesList } from './principles';
import type { Principle, PrincipleLetter } from './types';
import { letterLabels, letterHints } from './types';

export type { Principle, PrincipleLetter, QuizQuestion } from './types';
export { letterLabels, letterHints, categoryLabels, categoryHints } from './types';
export type { Pattern, PatternCategory } from './types';

/** All 5 SOLID principles in learning order (S → O → L → I → D). */
export const principles = principlesList;

/** @deprecated alias for shared components */
export const patterns = principles;

export function getPrinciple(slug: string): Principle | undefined {
  return principlesList.find((p) => p.slug === slug);
}

/** @deprecated */
export const getPattern = getPrinciple;

export { enrichPrinciple, enrichPattern } from './enrich';
export type { EnrichedPrinciple, EnrichedPattern } from './enrich';

export interface FinderRule {
  keywords: string[];
  principleSlug: string;
  hint: string;
}

/** @deprecated */
export type FinderRuleLegacy = FinderRule & { patternSlug: string };

export const finderRules: FinderRule[] = [
  {
    keywords: ['one job', 'one class', 'single responsibility', 'god class', 'too many duties', 'waiter chef', 'orders cooking', 'billing'],
    principleSlug: 'single-responsibility',
    hint: 'Split classes so each has only one reason to change',
  },
  {
    keywords: ['extend', 'open closed', 'if else', 'new promo', 'plugin', 'without editing'],
    principleSlug: 'open-closed',
    hint: 'Add behavior with new classes, not by editing stable code',
  },
  {
    keywords: ['substitute', 'liskov', 'extends', 'throws', 'unsupported', 'subtype', 'inheritance'],
    principleSlug: 'liskov-substitution',
    hint: 'Subtypes must work wherever the base type is expected',
  },
  {
    keywords: ['fat interface', 'segregation', 'not supported', 'forced to implement', 'kitchen sink'],
    principleSlug: 'interface-segregation',
    hint: 'Prefer small interfaces over one contract with unused methods',
  },
  {
    keywords: ['depend', 'inversion', 'inject', 'abstraction', 'concrete', 'new inside', 'hardwired'],
    principleSlug: 'dependency-inversion',
    hint: 'Depend on abstractions; inject implementations at the edges',
  },
].map((r) => ({ ...r, patternSlug: r.principleSlug }));
