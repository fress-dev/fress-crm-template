import path from "node:path";
import type { Plugin } from "vite";

const overrides: Array<{ pattern: RegExp; replacement: string }> = [
  {
    pattern: /atomic-crm\/misc\/RelativeDate\.tsx$/,
    replacement: "src/custom/misc/RelativeDate.tsx",
  },
  {
    pattern: /atomic-crm\/dashboard\/LatestNotes\.tsx$/,
    replacement: "src/custom/dashboard/LatestNotes.tsx",
  },
  {
    pattern: /atomic-crm\/notes\/utils\.ts$/,
    replacement: "src/custom/notes/utils.ts",
  },
  {
    pattern: /atomic-crm\/notes\/NoteCreate\.tsx$/,
    replacement: "src/custom/notes/NoteCreate.tsx",
  },
  {
    pattern: /atomic-crm\/notes\/NoteCreateSheet\.tsx$/,
    replacement: "src/custom/notes/NoteCreateSheet.tsx",
  },
  {
    pattern: /atomic-crm\/contacts\/ContactInputs\.core\.tsx$/,
    replacement: "src/components/atomic-crm/contacts/ContactInputs.tsx",
  },
  {
    pattern: /atomic-crm\/contacts\/ContactInputs\.tsx$/,
    replacement: "src/custom/plugins/stores/ContactInputs.tsx",
  },
  {
    pattern: /atomic-crm\/contacts\/ContactListFilter\.core\.tsx$/,
    replacement: "src/components/atomic-crm/contacts/ContactListFilter.tsx",
  },
  {
    pattern: /atomic-crm\/contacts\/ContactListFilter\.tsx$/,
    replacement: "src/custom/plugins/stores/ContactListFilter.tsx",
  },
];

const resolveCandidate = (source: string, importer: string, root: string) => {
  const base = source.startsWith(".")
    ? path.resolve(path.dirname(importer), source)
    : path.isAbsolute(source)
      ? source
      : path.resolve(root, source);

  return [base, `${base}.ts`, `${base}.tsx`];
};

/** コアの相対 import を custom 実装へ確実に差し替える */
export const customModuleOverrides = (root: string): Plugin => ({
  name: "custom-module-overrides",
  enforce: "pre",
  resolveId(source, importer) {
    if (!importer || source.includes("\0")) {
      return null;
    }

    for (const candidate of resolveCandidate(source, importer, root)) {
      const normalized = candidate.replace(/\\/g, "/");
      for (const { pattern, replacement } of overrides) {
        if (pattern.test(normalized)) {
          return path.resolve(root, replacement);
        }
      }
    }

    return null;
  },
});
