// Run this script once to fix any claims that have 'completed' status but shouldn't
// This resets 'completed' claims back to 'approved' so you can test the handoff flow

import dbConnect from './src/lib/db';
import Claim from './src/models/Claim';

async function fixClaimStatuses() {
    try {
        await dbConnect();

        // Find all claims with 'completed' status that don't have handoff code
        // (meaning they were set to completed by the old code, not by actual handoff)
        const result = await Claim.updateMany(
            {
                status: 'completed',
                handoffCodeHash: { $exists: false }
            },
            {
                $set: { status: 'approved' }
            }
        );

        console.log(`✅ Fixed ${result.modifiedCount} claims`);
        console.log('Claims that were incorrectly marked as completed are now approved.');
        console.log('You can now test the handoff flow properly.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixClaimStatuses();
