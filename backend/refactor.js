const fs = require('fs');
const path = require('path');

const backendDir = path.join('c:', 'Users', 'ragha', 'OneDrive', 'Desktop', 'institute lead maangment', 'backend');
const srcModulesDir = path.join(backendDir, 'src', 'modules');

const mappings = {
  'Lead': 'leads',
  'Course': 'core',
  'Discount': 'finance',
  'Fee': 'finance',
  'Payment': 'finance',
  'Question': 'leads',
  'Role': 'users',
  'Settings': 'core',
  'User': 'users',
  'Auth': 'users'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Move Models
const modelsDir = path.join(backendDir, 'models');
if (fs.existsSync(modelsDir)) {
  const modelDirs = fs.readdirSync(modelsDir);
  modelDirs.forEach(modelName => {
    const targetModule = mappings[modelName] || 'core';
    const targetDir = path.join(srcModulesDir, targetModule);
    ensureDir(targetDir);
    
    const modelPath = path.join(modelsDir, modelName);
    if (fs.statSync(modelPath).isDirectory()) {
      const files = fs.readdirSync(modelPath);
      files.forEach(file => {
        const oldFile = path.join(modelPath, file);
        const newFileName = file.toLowerCase().replace('.js', '.model.js').replace('.model.model.js', '.model.js');
        const newFile = path.join(targetDir, newFileName);
        fs.renameSync(oldFile, newFile);
        console.log(`Moved model: ${file} -> ${targetModule}/${newFileName}`);
      });
    }
  });
}

// 2. Move Controllers
const controllersDir = path.join(backendDir, 'controllers');
if (fs.existsSync(controllersDir)) {
  const controllerDirs = fs.readdirSync(controllersDir);
  controllerDirs.forEach(ctrlDirName => {
    const targetModule = mappings[ctrlDirName] || 'core';
    const targetDir = path.join(srcModulesDir, targetModule);
    ensureDir(targetDir);
    
    const ctrlPath = path.join(controllersDir, ctrlDirName);
    if (fs.statSync(ctrlPath).isDirectory()) {
      const files = fs.readdirSync(ctrlPath);
      files.forEach(file => {
        const oldFile = path.join(ctrlPath, file);
        let newFileName = file;
        if (!file.includes('.controller.')) {
          newFileName = file.replace('Controller.js', '.controller.js');
          newFileName = newFileName[0].toLowerCase() + newFileName.slice(1);
        }
        const newFile = path.join(targetDir, newFileName);
        fs.renameSync(oldFile, newFile);
        console.log(`Moved controller: ${file} -> ${targetModule}/${newFileName}`);
      });
    }
  });
}

// 3. Move Routes
const routesDir = path.join(backendDir, 'routes');
if (fs.existsSync(routesDir)) {
  const routeFiles = fs.readdirSync(routesDir);
  routeFiles.forEach(file => {
    if (file.endsWith('.js') && file !== 'uploadRoutes.js') {
      const baseName = file.replace('Routes.js', '').replace('routes.js', '').replace('.js', '');
      let targetModule = 'core';
      
      const lowerFile = file.toLowerCase();
      if (lowerFile.includes('lead')) targetModule = 'leads';
      else if (lowerFile.includes('user') || lowerFile.includes('auth') || lowerFile.includes('role')) targetModule = 'users';
      else if (lowerFile.includes('course') || lowerFile.includes('setting')) targetModule = 'core';
      else if (lowerFile.includes('fee') || lowerFile.includes('discount') || lowerFile.includes('payment')) targetModule = 'finance';
      else if (lowerFile.includes('question')) targetModule = 'leads';
      
      const targetDir = path.join(srcModulesDir, targetModule);
      ensureDir(targetDir);
      
      const oldFile = path.join(routesDir, file);
      const newFileName = baseName.toLowerCase() + '.routes.js';
      const newFile = path.join(targetDir, newFileName);
      fs.renameSync(oldFile, newFile);
      console.log(`Moved route: ${file} -> ${targetModule}/${newFileName}`);
    }
  });
}

console.log('Folder migration complete!');
