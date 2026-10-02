import type { LangRule, LanguageDef } from "../engine";
import { tokenizeWithRules } from "../engine";

const rules: LangRule[] = [
  { type: "keyword", re: /^#{1,6}[^\n]*/ym },
  { type: "string", re: /`[^`\n]+`/y },
  { type: "function", re: /\[[^\]\n]*\]\([^)\n]*\)/y },
  { type: "operator", re: /\*\*[^*\n]+\*\*|__[^_\n]+__/y },
  { type: "operator", re: /\*[^*\n]+\*|_[^_\n]+_/y },
  { type: "comment", re: /^>[^\n]*/ym },
  { type: "punctuation", re: /^[-*+]\s|^\d+\.\s/ym },
];

export const markdown: LanguageDef = {
  name: "Markdown",
  aliases: ["md", "markdown"],
  tokenize: (code: string) => tokenizeWithRules(code, rules),
};
