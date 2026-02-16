import dotenv from 'dotenv';
import { execSync } from 'child_process';
import fs from 'fs';

dotenv.config({ path: '.env' });

const apiKey = process.env.CONTENTSTACK_API_KEY;
const outputDir = './contentstack-schema';

if (!apiKey) {
  console.error('❌ Error: CONTENTSTACK_API_KEY not found in .env');
  console.error('Please add CONTENTSTACK_API_KEY to your .env file');
  process.exit(1);
}

// Delete existing directory if it exists
if (fs.existsSync(outputDir)) {
  console.log(`🗑️  Removing existing directory: ${outputDir}`);
  try {
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log('✅ Directory removed');
  } catch (error) {
    console.error('❌ Failed to remove directory:', error);
    process.exit(1);
  }
}

const command = `csdx cm:stacks:export -k ${apiKey} -d ${outputDir}`;

console.log('📦 Exporting Contentstack schema...');
try {
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Export complete!');
} catch (error) {
  console.error('❌ Export failed');
  process.exit(1);
}