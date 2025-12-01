const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasClientId = envContent.includes('GOOGLE_CLIENT_ID=');
    const hasClientSecret = envContent.includes('GOOGLE_CLIENT_SECRET=');
    const hasNextAuthSecret = envContent.includes('NEXTAUTH_SECRET=');

    console.log('Environment Variables Check:');
    console.log('GOOGLE_CLIENT_ID present:', hasClientId);
    console.log('GOOGLE_CLIENT_SECRET present:', hasClientSecret);
    console.log('NEXTAUTH_SECRET present:', hasNextAuthSecret);
} catch (error) {
    console.error('Error reading .env.local:', error.message);
}
