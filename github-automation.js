#!/usr/bin/env node

/**
 * GitHub Auto-Commit Automation Script
 * GoGo Jutta Ghar Website Repository
 *
 * RULES AND REGULATIONS:
 * 1. This script automatically commits and pushes changes to GitHub
 * 2. Only run this script when you have made significant changes to the website
 * 3. The script will automatically generate commit messages based on file changes
 * 4. Never run this script on production-critical changes without testing
 * 5. The script requires git to be installed and configured
 * 6. Always ensure you are on the correct branch before running
 * 7. The script will push to the default remote repository
 * 8. Commit messages follow conventional format: "feat/fix/docs/style/refactor/test/chore: description"
 * 9. Large binary files (images, videos) should be committed separately
 * 10. Never commit sensitive information (API keys, passwords, etc.)
 *
 * USAGE:
 * node github-automation.js [commit-type] [description]
 *
 * EXAMPLES:
 * node github-automation.js feat "add new product catalog page"
 * node github-automation.js fix "resolve mobile layout issues"
 * node github-automation.js docs "update README with setup instructions"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  ALLOWED_COMMIT_TYPES: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'build'],
  MAX_COMMIT_MESSAGE_LENGTH: 72,
  BRANCH_PROTECTION: ['main', 'master', 'production'],
  EXCLUDED_FILES: ['node_modules', '.env', '*.log', '.DS_Store', 'dist', 'build'],
  REQUIRED_FILES: ['package.json'], // Files that must exist for valid project
};

// Validation functions
function validateEnvironment() {
  try {
    // Check if git is installed
    execSync('git --version', { stdio: 'pipe' });
    console.log('✓ Git is installed');

    // Check if we're in a git repository
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    console.log('✓ Inside a git repository');

    // Check for required project files
    CONFIG.REQUIRED_FILES.forEach(file => {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file missing: ${file}`);
      }
    });
    console.log('✓ Project files validated');

    // Check current branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (CONFIG.BRANCH_PROTECTION.includes(currentBranch)) {
      console.warn(`⚠️  You are on protected branch: ${currentBranch}`);
      console.warn('⚠️  Consider creating a feature branch first');
    } else {
      console.log(`✓ Current branch: ${currentBranch}`);
    }

  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    process.exit(1);
  }
}

function getChangedFiles() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const files = status.split('\n')
      .filter(line => line.trim())
      .map(line => line.substring(3).trim())
      .filter(file => {
        // Exclude files matching patterns
        return !CONFIG.EXCLUDED_FILES.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(file);
          }
          return file.includes(pattern);
        });
      });

    return files;
  } catch (error) {
    console.error('❌ Failed to get changed files:', error.message);
    return [];
  }
}

function generateCommitMessage(type, description, files) {
  // Auto-generate description if not provided
  if (!description) {
    const fileTypes = {
      '.tsx': 'React component',
      '.ts': 'TypeScript',
      '.js': 'JavaScript',
      '.css': 'styling',
      '.json': 'configuration',
      '.md': 'documentation',
      '.html': 'markup'
    };

    const extensions = [...new Set(files.map(file => path.extname(file)))];
    const mainExtension = extensions[0];
    const fileType = fileTypes[mainExtension] || 'files';

    if (files.length === 1) {
      description = `update ${files[0]}`;
    } else if (files.length <= 3) {
      description = `update ${files.join(', ')}`;
    } else {
      description = `update ${files.length} ${fileType} files`;
    }
  }

  const commitMessage = `${type}: ${description}`;

  if (commitMessage.length > CONFIG.MAX_COMMIT_MESSAGE_LENGTH) {
    console.warn(`⚠️  Commit message is ${commitMessage.length} characters (max: ${CONFIG.MAX_COMMIT_MESSAGE_LENGTH})`);
    console.warn('⚠️  Consider shortening the description');
  }

  return commitMessage;
}

function checkForSensitiveFiles(files) {
  const sensitivePatterns = [
    /\.env$/,
    /secret/i,
    /key/i,
    /password/i,
    /token/i,
    /config.*\.json$/i
  ];

  const sensitiveFiles = files.filter(file =>
    sensitivePatterns.some(pattern => pattern.test(file))
  );

  if (sensitiveFiles.length > 0) {
    console.error('❌ Sensitive files detected:', sensitiveFiles.join(', '));
    console.error('❌ Remove sensitive files before committing');
    process.exit(1);
  }
}

function performGitOperations(commitMessage) {
  try {
    console.log('\n📋 Staging changes...');
    execSync('git add .', { stdio: 'inherit' });

    console.log('📝 Committing changes...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    console.log('🚀 Pushing to remote...');
    execSync('git push', { stdio: 'inherit' });

    console.log('✅ Successfully committed and pushed!');
    console.log(`📋 Commit message: "${commitMessage}"`);

  } catch (error) {
    console.error('❌ Git operation failed:', error.message);
    process.exit(1);
  }
}

function showUsage() {
  console.log(`
🤖 GoGo Jutta Ghar GitHub Auto-Commit Script

USAGE:
  node github-automation.js [commit-type] [description]

COMMIT TYPES:
  feat     - New features
  fix      - Bug fixes
  docs     - Documentation changes
  style    - Code style changes (formatting, etc.)
  refactor - Code refactoring
  test     - Adding or updating tests
  chore    - Maintenance tasks
  perf     - Performance improvements
  ci       - CI/CD changes
  build    - Build system changes

EXAMPLES:
  node github-automation.js feat "add new product catalog page"
  node github-automation.js fix "resolve mobile layout issues"
  node github-automation.js docs "update README with setup instructions"
  node github-automation.js style "format code with prettier"

RULES:
  • Only run after testing your changes
  • Never commit sensitive information
  • Use descriptive commit messages
  • Consider creating feature branches for major changes
  • The script will auto-generate descriptions if not provided
`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const commitType = args[0];
  const description = args.slice(1).join(' ');

  // Show usage if no arguments or help requested
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showUsage();
    return;
  }

  // Validate commit type
  if (!CONFIG.ALLOWED_COMMIT_TYPES.includes(commitType)) {
    console.error(`❌ Invalid commit type: ${commitType}`);
    console.error(`Allowed types: ${CONFIG.ALLOWED_COMMIT_TYPES.join(', ')}`);
    process.exit(1);
  }

  console.log('🚀 Starting GitHub auto-commit process...');
  console.log(`📝 Commit type: ${commitType}`);
  console.log(`📋 Description: ${description || '(auto-generated)'}`);

  // Validate environment
  validateEnvironment();

  // Get changed files
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('ℹ️  No changes to commit');
    return;
  }

  console.log(`📁 Changed files (${changedFiles.length}):`);
  changedFiles.forEach(file => console.log(`   • ${file}`));

  // Check for sensitive files
  checkForSensitiveFiles(changedFiles);

  // Generate commit message
  const commitMessage = generateCommitMessage(commitType, description, changedFiles);
  console.log(`📝 Generated commit message: "${commitMessage}"`);

  // Confirm with user
  console.log('\n⚠️  Ready to commit and push changes?');
  console.log('⚠️  Press Ctrl+C to cancel, or wait 5 seconds to proceed...');

  setTimeout(() => {
    performGitOperations(commitMessage);
  }, 5000);
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };