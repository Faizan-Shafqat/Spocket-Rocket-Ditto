const fs = require("fs");
const path = require("path");

// 🚀 Extensions to SKIP (heavy / unnecessary for installer)
const SKIP_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot)$/i;

// Optional: skip entire folders if needed
const SKIP_FOLDERS = ["node_modules", ".git"];

function walk(dir) {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    // 🚫 Skip unwanted folders
    if (SKIP_FOLDERS.some(folder => fullPath.includes(folder))) {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      // 🚫 Skip heavy binary files
      if (SKIP_EXTENSIONS.test(fullPath)) {
        console.log(`⏭ Skipping asset: ${fullPath}`);
        return;
      }

      try {
        const content = fs.readFileSync(fullPath, "utf8");

        results.push({
          path: fullPath
            .replace("local-theme\\", "")
            .replace(/\\/g, "/"),
          content,
          isBinary: false
        });

      } catch (err) {
        console.error(`❌ Failed to read: ${fullPath}`, err.message);
      }
    }
  });

  return results;
}

// 🚀 Start conversion
const files = walk("./local-theme");

// Save output
fs.writeFileSync(
  "themeFiles.js",
  "module.exports = " + JSON.stringify(files, null, 2)
);

console.log(`🔥 themeFiles.js generated with ${files.length} files`);