/**
 * Patches @vitejs/plugin-react by creating dist/refresh-runtime.js with ESM-wrapped
 * content so /@react-refresh serves valid ES module exports (injectIntoGlobalHook etc).
 * Run after npm install (postinstall).
 */
const fs = require("fs");
const path = require("path");

const distDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "@vitejs",
  "plugin-react",
  "dist"
);
const outPath = path.join(distDir, "refresh-runtime.js");
const runtimePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-refresh",
  "cjs",
  "react-refresh-runtime.development.js"
);
const refreshUtilsPath = path.join(distDir, "refreshUtils.js");

if (!fs.existsSync(runtimePath) || !fs.existsSync(refreshUtilsPath)) {
  process.exit(0);
}

const runtimeContent = fs.readFileSync(runtimePath, "utf-8");
const refreshUtilsContent = fs.readFileSync(refreshUtilsPath, "utf-8");

const esmContent = `const exports = {};
${runtimeContent}
${refreshUtilsContent}
export default exports;
`;

fs.writeFileSync(outPath, esmContent, "utf-8");
