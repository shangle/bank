const dayjs = require('dayjs');

/**
 * VibeBank Test Suite
 * Verifies core logic for balance calculation and transaction generation.
 */

// Mocking the core logic for the test environment
const VibeBankCore = {
    calculateBalance: function(transactions, initialBalance = 0) {
        if (!transactions || !Array.isArray(transactions)) return initialBalance;
        return transactions.reduce((acc, t) => {
            const amount = typeof t.amount === 'object' ? t.amount.value : t.amount;
            const type = typeof t.type === 'object' ? t.type.value : t.type;
            const amt = parseFloat(amount);
            if (isNaN(amt)) return acc;
            return type === 'income' ? acc + amt : acc - amt;
        }, initialBalance);
    },

    generateTransactions: function(rules, startDateStr, endDateStr) {
        const start = dayjs(startDateStr).startOf('day');
        const end = dayjs(endDateStr).endOf('day');
        const today = dayjs().startOf('day');
        const transactions = [];

        let current = start;
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            rules.forEach(rule => {
                const desc = rule.ruleDescription;
                if (!desc) return;

                const probStr = rule.ruleProbability !== undefined ? rule.ruleProbability : 100;
                const prob = parseFloat(probStr);
                if (!isNaN(prob) && Math.random() * 100 > prob) return;

                const freq = rule.ruleFrequency || 'daily';
                let shouldOccur = false;

                switch (freq) {
                    case 'daily': shouldOccur = true; break;
                    case 'weekly': if (current.day() === 1) shouldOccur = true; break;
                    case 'monthly': if (current.date() === 1) shouldOccur = true; break;
                    case 'once': if (current.isSame(start, 'day')) shouldOccur = true; break;
                }

                if (shouldOccur) {
                    const base = parseFloat(rule.ruleAmount || 0) || 0;
                    const variance = parseFloat(rule.ruleVariability || 0) || 0;
                    const randomVar = (Math.random() * 2 - 1) * (variance / 100) * base;
                    const finalAmount = Math.max(0, base + randomVar);

                    transactions.push({
                        date: current.format('YYYY-MM-DD'),
                        description: desc,
                        type: rule.ruleType || 'expense',
                        amount: finalAmount.toFixed(2),
                        status: current.isAfter(today) ? "Scheduled" : "Cleared"
                    });
                }
            });
            current = current.add(1, 'day');
        }
        return transactions;
    }
};

function runTests() {
    console.log("🚀 Starting VibeBank Core Logic Test Suite...\n");

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`✅ [PASS] ${message}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${message}`);
            failed++;
        }
    }

    // --- Test 1: Balance Calculation ---
    const testTransactions = [
        { amount: "100.00", type: "income" },
        { amount: "50.00", type: "expense" },
        { amount: "25.50", type: "expense" }
    ];
    const balance = VibeBankCore.calculateBalance(testTransactions, 1000);
    assert(balance === 1024.5, `Balance calculation (Expected 1024.5, got ${balance})`);

    // --- Test 2: Handle Empty Ledger ---
    const emptyBalance = VibeBankCore.calculateBalance([], 500);
    assert(emptyBalance === 500, `Empty ledger balance (Expected 500, got ${emptyBalance})`);

    // --- Test 3: Handle Non-numeric Inputs ---
    const invalidTransactions = [
        { amount: "abc", type: "income" },
        { amount: "50.00", type: "expense" }
    ];
    const invalidBalance = VibeBankCore.calculateBalance(invalidTransactions, 100);
    assert(invalidBalance === 50, `Invalid input handling (Expected 50, got ${invalidBalance})`);

    // --- Test 4: Transaction Generation (Daily) ---
    const dailyRules = [{ ruleDescription: "Coffee", ruleAmount: 5, ruleFrequency: "daily", ruleProbability: 100 }];
    const txs = VibeBankCore.generateTransactions(dailyRules, '2023-10-01', '2023-10-07');
    assert(txs.length === 7, `Daily transaction generation (Expected 7, got ${txs.length})`);

    // --- Test 5: Transaction Generation (Monthly) ---
    const monthlyRules = [{ ruleDescription: "Rent", ruleAmount: 1000, ruleFrequency: "monthly", ruleProbability: 100 }];
    const monthlyTxs = VibeBankCore.generateTransactions(monthlyRules, '2023-10-01', '2023-11-01');
    assert(monthlyTxs.length === 2, `Monthly transaction generation (Expected 2, got ${monthlyTxs.length})`);

    // --- Test 6: Probability Check ---
    const zeroProbRules = [{ ruleDescription: "Never", ruleAmount: 100, ruleFrequency: "daily", ruleProbability: 0 }];
    const zeroTxs = VibeBankCore.generateTransactions(zeroProbRules, '2023-10-01', '2023-10-31');
    assert(zeroTxs.length === 0, `Zero probability rule (Expected 0, got ${zeroTxs.length})`);

    console.log(`\n--- Test Summary ---`);
    console.log(`Total: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
