const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
console.log("Testing Connection to:", connectionString.replace(/:[^:@]+@/, ':****@')); // Hide pass

const prisma = new PrismaClient({
    datasourceUrl: connectionString,
    log: ['info', 'query', 'error', 'warn']
});

async function main() {
    try {
        console.log("Attempting to connect...");
        await prisma.$connect();
        console.log("SUCCESS: Connected to database!");
    } catch (e) {
        console.error("FAILURE: Connection Failed.");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
