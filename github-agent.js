#!/usr/bin/env node

/**
 * GitHub Auto-Commit Agent for GoGo Jutta Ghar Website
 *
 * This script automatically commits and pushes changes to the GitHub repository
 * following predefined rules and regulations for professional business website maintenance.
 *
 * Usage: node github-agent.js [options]
 *
 * Rules and Regulations:
 * 1. Only commit changes that improve the business website functionality
 * 2. Ensure all changes are tested and build successfully before committing
 * 3. Use descriptive commit messages following conventional commit format
 * 4. Never commit sensitive information (API keys, passwords, etc.)
 * 5. Always push to the main branch after successful commits
 * 6. Maintain clean git history with meaningful commit messages
 * 7. Only commit files related to the website (no system files, logs, etc.)
 * 8. Validate that the website builds successfully before committing
 * 9. Include relevant keywords in commit messages for better searchability
 * 10. Follow semantic versioning for major feature updates
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitHubAutoCommitAgent {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.allowedExtensions = [
      '.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.html',
      '.json', '.md', '.yml', '.yaml', '.toml', '.config.js',
      '.config.ts', '.env.example'
    ];
    this.blockedFiles = [
      '.env', '.env.local', '.env.production', '.env.development',
      'node_modules', '.git', 'dist', 'build', '.next',
      '*.log', '.DS_Store', 'Thumbs.db'
    ];
  }

  /**
   * Main execution method
   */
  async execute(options = {}) {
    try {
      console.log('🚀 GitHub Auto-Commit Agent Started');
      console.log('=====================================');

      // Step 1: Validate environment
      await this.validateEnvironment();

      // Step 2: Check for changes
      const hasChanges = this.checkForChanges();
      if (!hasChanges) {
        console.log('✅ No changes detected. Repository is up to date.');
        return;
      }

      // Step 3: Validate build
      await this.validateBuild();

      // Step 4: Filter and stage changes
      const stagedFiles = this.stageChanges();

      // Step 5: Generate commit message
      const commitMessage = this.generateCommitMessage(stagedFiles, options);

      // Step 6: Commit changes
      this.commitChanges(commitMessage);

      // Step 7: Push to repository
      this.pushChanges();

      console.log('✅ All operations completed successfully!');
      console.log('=====================================');

    } catch (error) {
      console.error('❌ Error during auto-commit process:', error.message);
      process.exit(1);
    }
  }

  /**
   * Validate the environment and prerequisites
   */
  async validateEnvironment() {
    console.log('🔍 Validating environment...');

    // Check if we're in a git repository
    try {
      execSync('git rev-parse --git-dir', { cwd: this.projectRoot, stdio: 'pipe' });
    } catch (error) {
      throw new Error('Not a git repository. Please initialize git first.');
    }

    // Check if remote origin exists
    try {
      execSync('git remote get-url origin', { cwd: this.projectRoot, stdio: 'pipe' });
    } catch (error) {
      throw new Error('No remote origin configured. Please add a GitHub remote.');
    }

    // Check git status
    const status = execSync('git status --porcelain', { cwd: this.projectRoot, encoding: 'utf8' });
    if (!status.trim()) {
      console.log('ℹ️  No changes to commit.');
      return false;
    }

    console.log('✅ Environment validation passed');
    return true;
  }

  /**
   * Check if there are any changes to commit
   */
  checkForChanges() {
    console.log('🔍 Checking for changes...');

    const status = execSync('git status --porcelain', { cwd: this.projectRoot, encoding: 'utf8' });
    const hasChanges = status.trim().length > 0;

    if (hasChanges) {
      console.log('📝 Changes detected:');
      console.log(status);
    }

    return hasChanges;
  }

  /**
   * Validate that the project builds successfully
   */
  async validateBuild() {
    console.log('🔨 Validating build...');

    try {
      // Check if package.json exists
      if (!fs.existsSync(path.join(this.projectRoot, 'package.json'))) {
        throw new Error('package.json not found');
      }

      // Run build command
      execSync('npm run build', {
        cwd: this.projectRoot,
        stdio: 'inherit',
        timeout: 300000 // 5 minutes timeout
      });

      console.log('✅ Build validation passed');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  /**
   * Stage appropriate changes for commit
   */
  stageChanges() {
    console.log('📦 Staging changes...');

    const statusOutput = execSync('git status --porcelain', { cwd: this.projectRoot, encoding: 'utf8' });
    const files = statusOutput.split('\n').filter(line => line.trim());

    const stagedFiles = [];

    for (const file of files) {
      const status = file.substring(0, 2);
      const filePath = file.substring(3);

      // Skip blocked files
      if (this.isBlockedFile(filePath)) {
        console.log(`🚫 Skipping blocked file: ${filePath}`);
        continue;
      }

      // Only stage allowed file types
      if (!this.isAllowedFile(filePath)) {
        console.log(`🚫 Skipping non-allowed file: ${filePath}`);
        continue;
      }

      // Stage the file
      try {
        execSync(`git add "${filePath}"`, { cwd: this.projectRoot });
        stagedFiles.push({ path: filePath, status });
        console.log(`✅ Staged: ${filePath}`);
      } catch (error) {
        console.log(`⚠️  Failed to stage: ${filePath} - ${error.message}`);
      }
    }

    if (stagedFiles.length === 0) {
      throw new Error('No valid files to stage');
    }

    console.log(`✅ Staged ${stagedFiles.length} files`);
    return stagedFiles;
  }

  /**
   * Generate an appropriate commit message
   */
  generateCommitMessage(stagedFiles, options) {
    console.log('📝 Generating commit message...');

    const { type = 'feat', scope = 'website', description } = options;

    // Analyze changes to determine commit type
    const hasNewFeatures = stagedFiles.some(file =>
      file.status.includes('A') || file.status.includes('M')
    );

    const hasFixes = stagedFiles.some(file =>
      file.path.includes('fix') || file.path.includes('bug')
    );

    const hasStyleChanges = stagedFiles.some(file =>
      file.path.endsWith('.css') || file.path.endsWith('.scss') ||
      file.path.includes('style') || file.path.includes('design')
    );

    const hasDocumentation = stagedFiles.some(file =>
      file.path.endsWith('.md') || file.path.includes('docs')
    );

    // Determine commit type
    let commitType = type;
    if (hasFixes) commitType = 'fix';
    else if (hasStyleChanges) commitType = 'style';
    else if (hasDocumentation) commitType = 'docs';
    else if (hasNewFeatures) commitType = 'feat';

    // Generate description
    let commitDescription = description;
    if (!commitDescription) {
      const fileTypes = [...new Set(stagedFiles.map(f => path.extname(f.path)))];
      const areas = stagedFiles.map(f => {
        const parts = f.path.split('/');
        return parts.length > 1 ? parts[0] : 'root';
      }).filter((v, i, a) => a.indexOf(v) === i);

      if (fileTypes.includes('.tsx') || fileTypes.includes('.ts')) {
        commitDescription = `update ${areas.join(', ')} components and functionality`;
      } else if (fileTypes.includes('.css') || fileTypes.includes('.scss')) {
        commitDescription = `update styling and design for ${areas.join(', ')}`;
      } else if (fileTypes.includes('.md')) {
        commitDescription = `update documentation and content`;
      } else {
        commitDescription = `update ${areas.join(', ')} files`;
      }
    }

    const commitMessage = `${commitType}(${scope}): ${commitDescription}`;

    console.log(`📝 Commit message: "${commitMessage}"`);
    return commitMessage;
  }

  /**
   * Commit the staged changes
   */
  commitChanges(message) {
    console.log('💾 Committing changes...');

    try {
      execSync(`git commit -m "${message}"`, {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      console.log('✅ Changes committed successfully');
    } catch (error) {
      throw new Error(`Commit failed: ${error.message}`);
    }
  }

  /**
   * Push changes to the remote repository
   */
  pushChanges() {
    console.log('🚀 Pushing changes to repository...');

    try {
      execSync('git push origin main', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      console.log('✅ Changes pushed successfully');
    } catch (error) {
      // Try with master branch if main fails
      try {
        execSync('git push origin master', {
          cwd: this.projectRoot,
          stdio: 'inherit'
        });
        console.log('✅ Changes pushed to master branch');
      } catch (pushError) {
        throw new Error(`Push failed: ${pushError.message}`);
      }
    }
  }

  /**
   * Check if a file is blocked from committing
   */
  isBlockedFile(filePath) {
    return this.blockedFiles.some(blocked => {
      if (blocked.includes('*')) {
        const pattern = blocked.replace(/\*/g, '.*');
        return new RegExp(pattern).test(filePath);
      }
      return filePath.includes(blocked);
    });
  }

  /**
   * Check if a file is allowed to be committed
   */
  isAllowedFile(filePath) {
    const ext = path.extname(filePath);
    return this.allowedExtensions.includes(ext) ||
           this.allowedExtensions.some(allowedExt => filePath.endsWith(allowedExt));
  }
}

// CLI interface
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      options[key] = value || true;
    } else if (arg.startsWith('-')) {
      const key = arg.substring(1);
      options[key] = args[i + 1] || true;
      if (options[key] !== true) i++;
    } else {
      options.description = arg;
    }
  }

  return options;
}

// Execute the agent
if (require.main === module) {
  const options = parseArgs();
  const agent = new GitHubAutoCommitAgent();

  agent.execute(options).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = GitHubAutoCommitAgent;