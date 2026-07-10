const fs = require('fs');
const path = require('path');

const srcModulesDir = path.join('c:', 'Users', 'ragha', 'OneDrive', 'Desktop', 'institute lead maangment', 'backend', 'src', 'modules');

const pathReplacements = [
  // Controllers
  { match: /\.\.\/controllers\/Auth\/authController/g, replace: './auth.controller' },
  { match: /\.\.\/\.\.\/controllers\/Auth\/authController/g, replace: '../users/auth.controller' },
  { match: /\.\.\/controllers\/Lead\/leadController/g, replace: './lead.controller' },
  { match: /\.\.\/\.\.\/controllers\/Lead\/leadController/g, replace: '../leads/lead.controller' },
  { match: /\.\.\/controllers\/Course\/courseController/g, replace: './course.controller' },
  { match: /\.\.\/\.\.\/controllers\/Course\/courseController/g, replace: '../core/course.controller' },
  { match: /\.\.\/controllers\/Question\/questionController/g, replace: './question.controller' },
  { match: /\.\.\/\.\.\/controllers\/Question\/questionController/g, replace: '../leads/question.controller' },
  { match: /\.\.\/controllers\/Settings\/settingsController/g, replace: './settings.controller' },
  { match: /\.\.\/\.\.\/controllers\/Settings\/settingsController/g, replace: '../core/settings.controller' },
  { match: /\.\.\/controllers\/Fee\/feeController/g, replace: './fee.controller' },
  { match: /\.\.\/\.\.\/controllers\/Fee\/feeController/g, replace: '../finance/fee.controller' },
  { match: /\.\.\/controllers\/Discount\/discountController/g, replace: './discount.controller' },
  { match: /\.\.\/\.\.\/controllers\/Discount\/discountController/g, replace: '../finance/discount.controller' },
  { match: /\.\.\/controllers\/Payment\/paymentController/g, replace: './payment.controller' },
  { match: /\.\.\/\.\.\/controllers\/Payment\/paymentController/g, replace: '../finance/payment.controller' },
  { match: /\.\.\/controllers\/admin\/reportsController/g, replace: './reports.controller' },
  { match: /\.\.\/\.\.\/controllers\/admin\/reportsController/g, replace: '../core/reports.controller' },
  { match: /\.\.\/controllers\/admin\/statsController/g, replace: './stats.controller' },
  { match: /\.\.\/\.\.\/controllers\/admin\/statsController/g, replace: '../core/stats.controller' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      for (const rep of pathReplacements) {
        content = content.replace(rep.match, rep.replace);
      }
      
      // Also catch anything else like require('../controllers/Lead/courseController')
      // since route and controller are usually in the SAME module now
      // Let's replace any `../controllers/Module/fileController` with `./file.controller`
      content = content.replace(/\.\.\/controllers\/[A-Za-z]+\/([a-zA-Z]+)Controller/g, (match, p1) => {
          return `./${p1.toLowerCase()}.controller`;
      });
      content = content.replace(/\.\.\/\.\.\/controllers\/[A-Za-z]+\/([a-zA-Z]+)Controller/g, (match, p1) => {
          // This one is harder because we don't know which module it's in without the map
          // But hopefully the manual mapping above catches them.
          return match;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcModulesDir);
console.log('Fixed controller imports');
