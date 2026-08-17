import type { Principle } from './types';
import { principleCode } from './principle-code';
import { principleStories, type PrincipleStory } from './principle-stories';
import { deriveRunExpect } from '../../utils/run-expect';

export interface EnrichedPrinciple extends Principle {
  exampleName: string;
  overview: string;
  problemStatement: string;
  tradeoffIntro: string;
  sceneSteps: [string, string, string];
  withoutPatternPains: [string, string, string];
  withPatternWins: [string, string, string];
  codeBridge: string;
  runExpect: string;
  tryItSteps: string[];
  codeTakeaway: string;
  runDemo: string;
  codeBeforeHint: string;
  codeAfterHint: string;
  displayCodeBefore: string;
  displayCodeAfter: string;
}

/** @deprecated */
export type EnrichedPattern = EnrichedPrinciple;

function tuple3(items: string[]): [string, string, string] {
  return [items[0] ?? '', items[1] ?? '', items[2] ?? ''];
}

function storyFor(principle: Principle): PrincipleStory {
  const story = principleStories[principle.slug];
  if (story) return story;

  return {
    example: principle.name,
    overview: principle.analogy,
    problemStatement: principle.problem,
    scene: tuple3(
      principle.analogy
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 8)
        .slice(0, 3),
    ),
    without: tuple3(
      principle.problem
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.length > 12)
        .slice(0, 3),
    ),
    with: tuple3(
      principle.solution
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.length > 12)
        .slice(0, 3),
    ),
    codeBridge: `See how ${principle.name} fixes this in the code below.`,
    codeBeforeHint: 'Without the principle — messy, coupled, hard to extend.',
    codeAfterHint: 'With the principle — same example, cleaner structure.',
    tryItSteps: ['Wait for the editor, click Run ▶, compare output below.'],
    tradeoffIntro: `Here is how the example plays out in code without and with ${principle.name}.`,
  };
}

export function enrichPrinciple(principle: Principle): EnrichedPrinciple {
  const story = storyFor(principle);
  const code = principleCode[principle.slug];
  const displayCodeBefore = code?.codeBefore ?? principle.codeBefore;
  const displayCodeAfter = code?.codeAfter ?? principle.codeAfter;
  const runDemo = displayCodeAfter;

  const overview =
    story.overview ??
    `${story.example}: ${story.scene[0]} ${story.scene[1]}`.trim();

  const tradeoffIntro =
    story.tradeoffIntro ??
    `We stay with the same example (${story.example}) and show what happens in Java when you violate ${principle.name} versus when you follow it.`;

  return {
    ...principle,
    exampleName: story.example,
    overview,
    problemStatement: story.problemStatement ?? principle.problem,
    tradeoffIntro,
    sceneSteps: story.scene,
    withoutPatternPains: story.without,
    withPatternWins: story.with,
    codeBridge: story.codeBridge,
    runExpect: deriveRunExpect(runDemo),
    tryItSteps: story.tryItSteps,
    displayCodeBefore,
    displayCodeAfter,
    codeTakeaway: story.codeBridge,
    runDemo,
    codeBeforeHint: story.codeBeforeHint,
    codeAfterHint: story.codeAfterHint,
  };
}

/** @deprecated */
export const enrichPattern = enrichPrinciple;
