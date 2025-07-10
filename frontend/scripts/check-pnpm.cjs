#!/usr/bin/env node

/**
 * Скрипт для принудительного использования pnpm как единственного пакетного менеджера
 * Предотвращает использование npm или yarn
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function checkPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  
  if (!userAgent) {
    console.log(`${GREEN}✓${RESET} Package manager check passed`);
    return;
  }

  const isUsingPnpm = userAgent.startsWith('pnpm');
  const isUsingNpm = userAgent.startsWith('npm');
  const isUsingYarn = userAgent.startsWith('yarn');

  if (isUsingNpm) {
    console.error(`${RED}❌ Использование npm запрещено!${RESET}`);
    console.error(`${YELLOW}📦 Пожалуйста, используйте pnpm:${RESET}`);
    console.error('   pnpm install');
    console.error('   pnpm add <package>');
    console.error('   pnpm remove <package>');
    process.exit(1);
  }

  if (isUsingYarn) {
    console.error(`${RED}❌ Использование yarn запрещено!${RESET}`);
    console.error(`${YELLOW}📦 Пожалуйста, используйте pnpm:${RESET}`);
    console.error('   pnpm install');
    console.error('   pnpm add <package>');
    console.error('   pnpm remove <package>');
    process.exit(1);
  }

  if (isUsingPnpm) {
    console.log(`${GREEN}✓${RESET} Используется pnpm - отлично!`);
    return;
  }

  // Дополнительная проверка наличия lock файлов других менеджеров
  const projectRoot = process.cwd();
  const packageLockPath = path.join(projectRoot, 'package-lock.json');
  const yarnLockPath = path.join(projectRoot, 'yarn.lock');

  if (fs.existsSync(packageLockPath)) {
    console.error(`${RED}❌ Найден package-lock.json!${RESET}`);
    console.error(`${YELLOW}🧹 Удалите его и используйте pnpm:${RESET}`);
    console.error('   rm package-lock.json');
    console.error('   pnpm install');
    process.exit(1);
  }

  if (fs.existsSync(yarnLockPath)) {
    console.error(`${RED}❌ Найден yarn.lock!${RESET}`);
    console.error(`${YELLOW}🧹 Удалите его и используйте pnpm:${RESET}`);
    console.error('   rm yarn.lock');
    console.error('   pnpm install');
    process.exit(1);
  }
}

// Проверка наличия pnpm в системе
function checkPnpmInstalled() {
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
  } catch (error) {
    console.error(`${RED}❌ pnpm не установлен!${RESET}`);
    console.error(`${YELLOW}📦 Установите pnpm:${RESET}`);
    console.error('   npm install -g pnpm');
    console.error('   # или');
    console.error('   curl -fsSL https://get.pnpm.io/install.sh | sh -');
    process.exit(1);
  }
}

// Основная проверка
checkPnpmInstalled();
checkPackageManager(); 