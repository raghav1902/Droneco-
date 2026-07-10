const fs = require('fs');
const path = require('path');

const srcModulesDir = path.join('c:', 'Users', 'ragha', 'OneDrive', 'Desktop', 'institute lead maangment', 'backend', 'src', 'modules');
const appJsPath = path.join('c:', 'Users', 'ragha', 'OneDrive', 'Desktop', 'institute lead maangment', 'backend', 'app.js');

const pathReplacements = [
  // Models
  { match: /\.\.\/\.\.\/models\/Lead\/Lead/g, replace: '../../leads/lead.model' },
  { match: /\.\.\/\.\.\/models\/Lead\/FeedbackLog/g, replace: '../../leads/feedbacklog.model' },
  { match: /\.\.\/\.\.\/models\/User\/User/g, replace: '../../users/user.model' },
  { match: /\.\.\/models\/User\/User/g, replace: '../users/user.model' },
  { match: /\.\.\/\.\.\/models\/Role\/Role/g, replace: '../../users/role.model' },
  { match: /\.\.\/\.\.\/models\/Course\/Course/g, replace: '../../core/course.model' },
  { match: /\.\.\/\.\.\/models\/Question\/Question/g, replace: '../../leads/question.model' },
  { match: /\.\.\/\.\.\/models\/Settings\/Settings/g, replace: '../../core/settings.model' },
  { match: /\.\.\/\.\.\/models\/Discount\/DiscountRule/g, replace: '../../finance/discountrule.model' },
  { match: /\.\.\/\.\.\/models\/Fee\/Fee/g, replace: '../../finance/fee.model' },
  { match: /\.\.\/\.\.\/models\/Payment\/Payment/g, replace: '../../finance/payment.model' },

  // Middleware paths
  { match: /\.\.\/\.\.\/middleware\//g, replace: '../../../middleware/' },
  { match: /\.\.\/\.\.\/utils\//g, replace: '../../../utils/' },
  { match: /\.\.\/\.\.\/validators\//g, replace: '../../../validators/' }
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
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(srcModulesDir);

// Fix app.js
let appContent = fs.readFileSync(appJsPath, 'utf8');
appContent = appContent.replace(/\.\/routes\//g, './src/modules/');
// manual fixes for specific routes in app.js
appContent = appContent.replace(/\/src\/modules\/auth/g, '/src/modules/users/auth.routes');
appContent = appContent.replace(/\/src\/modules\/leads/g, '/src/modules/leads/leads.routes');
appContent = appContent.replace(/\/src\/modules\/admin/g, '/src/modules/core/admin.routes');
appContent = appContent.replace(/\/src\/modules\/courses/g, '/src/modules/core/courses.routes');
appContent = appContent.replace(/\/src\/modules\/questions/g, '/src/modules/leads/questions.routes');
fs.writeFileSync(appJsPath, appContent);
console.log('Fixed app.js imports');
