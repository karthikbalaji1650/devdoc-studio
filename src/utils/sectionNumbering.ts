import type { DocSection } from '../types/document';

export function getSectionNumbers(sections: Pick<DocSection, 'level'>[]): string[] {
  const counters = [0, 0, 0];

  return sections.map((section) => {
    const levelIndex = section.level - 1;

    for (let index = 0; index <= levelIndex; index += 1) {
      if (index < levelIndex && counters[index] === 0) {
        counters[index] = 1;
      }
    }

    counters[levelIndex] += 1;
    counters.fill(0, levelIndex + 1);

    return counters.slice(0, section.level).join('.');
  });
}
