import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { generateTestForFile } from '../../generate-test-groq';
import logger from './logger';

const CONFIG = {
  srcFolders: {
    repo: 'src/repositories',
    service: 'src/services',
    controller: 'src/controllers',
  },
  testFolders: {
    repo: 'test_cases/repo',
    service: 'test_cases/service',
    controller: 'test_cases/controller',
  },
};

/**
 * Checks if a file needs a test (missing or outdated)
 */
function needsTest(sourcePath: string, testPath: string): boolean {
  if (!fs.existsSync(testPath)) return true;
  
  const sourceStat = fs.statSync(sourcePath);
  const testStat = fs.statSync(testPath);
  
  // If source was modified AFTER the test was created, it needs an update
  return sourceStat.mtime > testStat.mtime;
}

/**
 * Scans all source folders and finds the first file that needs a test
 */
async function findNextFileToTest() {
  for (const [key, srcDir] of Object.entries(CONFIG.srcFolders)) {
    const absSrcDir = path.resolve(srcDir);
    if (!fs.existsSync(absSrcDir)) continue;

    const files = fs.readdirSync(absSrcDir).filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'));
    const testDir = CONFIG.testFolders[key as keyof typeof CONFIG.testFolders];

    for (const file of files) {
      const sourcePath = path.join(srcDir, file);
      const testFile = file.replace('.ts', '.test.ts');
      const testPath = path.join(testDir, testFile);

      if (needsTest(sourcePath, testPath)) {
        return { sourcePath, testPath, type: key };
      }
    }
  }
  return null;
}

/**
 * Runs all tests and returns coverage summary and test results
 */
function runTests() {
  try {
    const output = execSync(
      'npx nyc --all --extension .ts --include "src/**/*.ts" --exclude "**/*.test.ts" --reporter=text-summary --reporter=html mocha --node-option no-experimental-strip-types --require ts-node/register "src/**/*.test.ts" "test_cases/**/*.test.ts"',
      { 
        encoding: 'utf-8', 
        stdio: 'pipe',
        env: { ...process.env, TS_NODE_TRANSPILE_ONLY: 'true' }
      }
    );
    return output;
  } catch (error: any) {
    return error.stdout || error.message;
  }
}

/**
 * Full Automation Protocol: Branch Sync, Test Creation, Commit, Execution, and Push
 */
export async function runTestCycle() {
  logger.info('[TestManager] Starting Full Automation Cycle...');
  const result: any = { success: false, logs: [], branch: 'test-cases' };

  try {
    // 1. Branch Validation & Sync
    logger.info('[TestManager] Step 1: Syncing branches...');
    try {
      execSync('git reset --hard', { stdio: 'ignore' }); // Clear any local changes blocking sync
      execSync('git checkout test-cases', { stdio: 'ignore' });
    } catch {
      execSync('git checkout -b test-cases', { stdio: 'ignore' });
    }
    execSync('git pull origin master --rebase', { stdio: 'ignore' });
    result.logs.push('Branch synced with master.');

    // 2. Test Case File Creation
    const target = await findNextFileToTest();
    if (!target) {
      result.logs.push('All tests are up to date.');
      return { ...result, success: true, message: 'No new tests needed.' };
    }
    
    logger.info(`[TestManager] Step 2: Creating test for ${target.sourcePath}`);
    const genSuccess = await generateTestForFile(target.sourcePath, target.testPath);
    if (!genSuccess) throw new Error(`Generation failed for ${target.sourcePath}`);
    result.targetFile = target.sourcePath;

    // 3. Commit Changes
    logger.info('[TestManager] Step 3: Committing changes...');
    execSync(`git add "${target.testPath}"`);
    const commitMsg = `auto: add/update test case for ${path.basename(target.sourcePath)}`;
    execSync(`git commit -m "${commitMsg}"`);
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    result.commit = commitHash;
    result.logs.push(`Committed: ${commitHash}`);

    // 4. Run All Test Cases
    logger.info('[TestManager] Step 4: Executing tests and coverage...');
    const rawOutput = runTests();
    
    const passingMatch = rawOutput.match(/(\d+) passing/);
    const failingMatch = rawOutput.match(/(\d+) failing/);
    result.passing = passingMatch ? passingMatch[1] : '0';
    result.failing = failingMatch ? failingMatch[1] : '0';
    result.total = (parseInt(result.passing) + parseInt(result.failing)).toString();

    const coverageIndex = rawOutput.indexOf('==== Coverage summary ====');
    result.report = coverageIndex !== -1 ? rawOutput.substring(coverageIndex) : 'Coverage hidden or failed';
    
    // Extract % for quick view
    const pctMatch = result.report.match(/Lines\s+:\s+(\d+\.\d+)%/);
    result.coveragePct = pctMatch ? pctMatch[1] : '0';

    // 5. Push Changes
    logger.info('[TestManager] Step 5: Pushing to remote...');
    try {
      execSync('git push origin test-cases', { stdio: 'ignore' });
      result.logs.push('Pushed to remote repository.');
    } catch (e: any) {
      result.logs.push(`Push skipped or failed: ${e.message}`);
    }

    result.success = true;
    return result;
  } catch (error: any) {
    logger.error(`[TestManager] Protocol Failed: ${error.message}`);
    return { ...result, success: false, message: error.message };
  }
}
