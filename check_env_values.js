const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env.local');
try {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));

    console.log('Environment Variables Value Check:');
    console.log('GOOGLE_CLIENT_ID has value:', !!envConfig.GOOGLE_CLIENT_ID && envConfig.GOOGLE_CLIENT_ID.length > 5);
    console.log('GOOGLE_CLIENT_SECRET has value:', !!envConfig.GOOGLE_CLIENT_SECRET && envConfig.GOOGLE_CLIENT_SECRET.length > 5);
    console.log('NEXTAUTH_SECRET has value:', !!envConfig.NEXTAUTH_SECRET && envConfig.NEXTAUTH_SECRET.length > 5);
    console.log('NEXTAUTH_URL:', envConfig.NEXTAUTH_URL);
    console.log('MONGODB_URI has value:', !!envConfig.MONGODB_URI);
} catch (error) {
    console.error('Error reading .env.local:', error.message);
}
