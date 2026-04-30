#!/usr/bin/env ts-node
/**
 * Unit Test Generator CLI (Groq Cloud API)
 * COMPLETELY FREE - Super fast, no local setup needed
 *
 * Usage: npx ts-node generate-test-groq.ts src/controllers/userController.ts
 *
 * Requirements:
 *   1. Get free API key from https://console.groq.com
 *   2. Set GROQ_API_KEY in .env or environment
 *   3. npm install -D ts-node axios
 */

import fs from "fs";
import path from "path";
import axios from "axios";
require("dotenv").config();

// ── Config ────────────────────────────────────────────────────────────────────
const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant"; // Fast & free on Groq
const TIMEOUT = 60000; // 60 seconds

// ── Helpers ───────────────────────────────────────────────────────────────────
function resolveApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error(
      "❌  GROQ_API_KEY is not set.\n\n" +
        "Steps to fix:\n" +
        "  1. Go to https://console.groq.com\n" +
        "  2. Sign up (free)\n" +
        "  3. Create an API key\n" +
        "  4. Set it in your .env file:\n" +
        "     GROQ_API_KEY=gsk_xxxxxxxxxxxx\n" +
        "  5. Run: npm run generate-test src/controllers/userController.ts\n"
    );
    process.exit(1);
  }
  return key;
}

function readSourceFile(filePath: string): string {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`❌  File not found: ${abs}`);
    process.exit(1);
  }
  return fs.readFileSync(abs, "utf-8");
}

function deriveTestPath(sourcePath: string): string {
  const parsed = path.parse(path.resolve(sourcePath));
  return path.join(parsed.dir, `${parsed.name}.test${parsed.ext}`);
}

function buildPrompt(sourceCode: string, fileName: string): string {
  return `You are an expert Node.js + TypeScript QA engineer.

Generate a complete, production-ready **Mocha + Chai** unit test file for the TypeScript source below.

IMPORTANT: Output ONLY valid TypeScript code. No markdown fences, no explanations.

Rules:
- Use \`mocha\`, \`chai\` (expect style), and \`sinon\` for mocking/stubbing
- Mock all external dependencies (MongoDB models, APIs, etc) with sinon stubs
- Cover: happy path, edge cases, error cases for EVERY exported function
- Use \`beforeEach\` / \`afterEach\` with \`sinon.restore()\`
- Add descriptive \`describe\` and \`it\` blocks
- Output ONLY valid TypeScript code

Source file: ${fileName}

\`\`\`typescript
${sourceCode}
\`\`\`

Generate the complete test file:`;
}

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:typescript|ts)?\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const [, , inputArg] = process.argv;

  if (!inputArg) {
    console.error(
      "Usage: npx ts-node generate-test-groq.ts <path/to/sourceFile.ts>\n" +
        "Example: npx ts-node generate-test-groq.ts src/controllers/userController.ts"
    );
    process.exit(1);
  }

  const apiKey = resolveApiKey();
  const sourceCode = readSourceFile(inputArg);
  const testFilePath = deriveTestPath(inputArg);
  const fileName = path.basename(inputArg);

  console.log(`\n🚀  Groq Cloud Test Generator`);
  console.log(`🔍  Analysing  : ${inputArg}`);
  console.log(`📝  Generating : ${testFilePath}`);
  console.log(`⏳  Processing...\n`);

  let generatedCode = "";

  try {
    const response = await axios.post(
      GROQ_API,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: buildPrompt(sourceCode, fileName),
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: TIMEOUT,
      }
    );

    generatedCode = response.data.choices[0]?.message?.content || "";

    if (!generatedCode.trim()) {
      console.error("❌  Model returned empty response. Try again.");
      process.exit(1);
    }

    const finalCode = stripMarkdownFences(generatedCode);

    fs.writeFileSync(testFilePath, finalCode, "utf-8");

    console.log(`✅  Test file saved: ${testFilePath}`);
    console.log(`\n📊  Generated ${finalCode.split("\n").length} lines of test code\n`);
    console.log(
      `💡  Next steps:\n` +
        `    1. npm install -D mocha chai sinon sinon-chai @types/mocha @types/chai @types/sinon\n` +
        `    2. Add to package.json:\n` +
        `         "test": "mocha --require ts-node/register 'src/**/*.test.ts'"\n` +
        `    3. npm test\n`
    );
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error(
        "❌  Invalid or missing API key.\n\n" +
          "Get a free API key:\n" +
          "  1. Go to https://console.groq.com\n" +
          "  2. Sign up for free\n" +
          "  3. Create an API key\n" +
          "  4. Add to .env: GROQ_API_KEY=gsk_xxxxxxxxxxxx\n"
      );
    } else if (error.response?.status === 429) {
      console.error(
        "❌  Rate limit hit. Wait a moment and try again.\n" +
          "Free tier has limits, but they reset frequently.\n"
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "❌  Network error. Check your internet connection.\n"
      );
    } else if (error.message.includes("timeout")) {
      console.error(
        "❌  Request timed out. Try again.\n"
      );
    } else if (error.response?.data?.error?.message) {
      console.error("❌  API Error:", error.response.data.error.message);
    } else {
      console.error("❌  Error:", error.message);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n❌  Unexpected error:", err.message ?? err);
  process.exit(1);
});