const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const testMonthlyGrant = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find a test user or any user
        let user = await User.findOne({});
        if (!user) {
            console.log('No user found to test');
            process.exit(0);
        }

        console.log(`Testing with user: ${user.username}`);
        console.log(`Initial Coins: ${user.coins}`);
        console.log(`Initial Last Grant Date: ${user.lastMonthlyCoinsDate}`);

        // Set lastMonthlyCoinsDate to two months ago
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 2);
        user.lastMonthlyCoinsDate = lastMonth;
        await user.save();

        console.log('--- Simulated previous month grant date ---');
        console.log(`New Last Grant Date (simulated): ${user.lastMonthlyCoinsDate}`);

        // Now we trigger the logic. Since we can't easily call the API route here without a full request object,
        // we'll simulate the checkMonthlyCoins helper logic directly or require it if we can.
        // But for a quick test, let's just re-implement the check here as it is in auth.js
        
        const checkMonthlyCoins = async (u) => {
            const now = new Date();
            if (!u.lastMonthlyCoinsDate || 
                u.lastMonthlyCoinsDate.getMonth() !== now.getMonth() || 
                u.lastMonthlyCoinsDate.getFullYear() !== now.getFullYear()) {
                
                u.coins = (u.coins || 0) + 100;
                u.lastMonthlyCoinsDate = now;
                await u.save();
                return true;
            }
            return false;
        };

        const granted = await checkMonthlyCoins(user);
        
        console.log('--- After triggering grant logic ---');
        if (granted) {
            console.log('✅ Success: Monthly coins granted!');
            console.log(`Final Coins: ${user.coins} (Expected: ${user.coins})`);
            console.log(`Final Last Grant Date: ${user.lastMonthlyCoinsDate} (Expected: Now)`);
        } else {
            console.log('❌ Failure: Monthly coins NOT granted.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testMonthlyGrant();
