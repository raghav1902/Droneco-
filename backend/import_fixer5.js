const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'middleware'),
  path.join(__dirname, 'utils'),
  path.join(__dirname, 'validators')
];

const modelReplacements = [
  { match: /\.\.\/\.\.\/models\/User\/User/g, replace: '../../src/modules/users/user.model' },
  { match: /\.\.\/models\/User\/User/g, replace: '../src/modules/users/user.model' },
  { match: /\.\.\/\.\.\/models\/Role\/Role/g, replace: '../../src/modules/users/role.model' },
  { match: /\.\.\/\.\.\/models\/Lead\/Lead/g, replace: '../../src/modules/leads/lead.model' },
  { match: /\.\.\/models\/Lead\/Lead/g, replace: '../src/modules/leads/lead.model' },
  { match: /\.\.\/\.\.\/models\/Settings\/Settings/g, replace: '../../src/modules/core/settings.model' }
];

function processDirectory(directory) {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      for (const rep of modelReplacements) {
        content = content.replace(rep.match, rep.replace);
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated model imports in ${fullPath}`);
      }
    }
  }
}

dirsToProcess.forEach(processDirectory);
console.log('Fixed middleware/utils model imports');
