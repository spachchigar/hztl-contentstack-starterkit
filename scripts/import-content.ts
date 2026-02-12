import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const args = process.argv.slice(2);
const apiKey = args[0] || process.env.CONTENTSTACK_API_KEY;
const inputDir = './cs-starterkit-schema';

if (!apiKey) {
    console.error('❌ Error: Stack API key is required');
    console.error('Usage: npm run import-content <api-key>');
    console.error('Example: npm run import-content blt1234567890abcdef');
    process.exit(1);
}

const command = `csdx cm:stacks:import -k ${apiKey} -d ${inputDir}`;

console.log('📥 Importing Contentstack schema...');
console.log(`Using directory: ${inputDir}`);
try {
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Import complete!');
} catch (error) {
    console.error('❌ Import failed');
    process.exit(1);
}