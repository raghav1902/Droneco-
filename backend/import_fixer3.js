const fs = require('fs');
const path = require('path');

const srcModulesDir = path.join(__dirname, 'src', 'modules');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      const moduleName = path.basename(directory); // e.g. "users", "core", "leads"

      // If a file in `users` imports `../../users/user.model`, it should be `./user.model`
      content = content.replace(new RegExp(`\\.\\.\\/\\.\\.\\/${moduleName}\\/`, 'g'), './');
      
      // If a file imports from another module, e.g. `../../leads/lead.model`, that path 
      // resolves to `backend/leads/lead.model` which is WRONG.
      // It should be `../leads/lead.model` from `backend/src/modules/core/course.controller.js`.
      content = content.replace(/\.\.\/\.\.\/([a-zA-Z]+)\//g, '../$1/');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated relative imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcModulesDir);
console.log('Fixed model imports part 3');
