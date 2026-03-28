/**
 * VibeBank Simulation Engine - "Average Joe" Edition
 * Core logic for backfilling, projecting, and handling UI transitions.
 */

// Define global functions on window to ensure they are accessible from HTML onclick handlers
window.startInstantOnboarding = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo) return;
    
    // Switch to onboarding page
    mavo.root.children.currentPage.setValue('onboarding');
    
    const updateProgress = (pct, text) => {
        const progressBar = document.getElementById('progress-bar');
        const verificationText = document.getElementById('verification-text');
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (verificationText) verificationText.innerText = text;
    };

    // Performance Art Verification Sequence
    setTimeout(() => updateProgress(30, 'Analyzing credit history...'), 300);
    setTimeout(() => updateProgress(65, 'Decrypting financial genetics...'), 1000);
    setTimeout(() => updateProgress(100, 'Identity verified. Opening ledger...'), 1800);

    setTimeout(() => {
        finishInstantOnboarding();
    }, 2200);
};

window.finishInstantOnboarding = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo) return;
    
    try {
        // Set Default Data
        mavo.root.children.accountName.setValue(DEFAULT_PERSONA.accountName);
        mavo.root.children.initialBalance.setValue(DEFAULT_PERSONA.initialBalance);
        
        // Set default backfill date
        if (mavo.root.children.backfillDate) {
            mavo.root.children.backfillDate.setValue(dayjs().subtract(30, 'days').format('YYYY-MM-DD'));
        }
        
        const rulesList = mavo.root.children.rule;
        if (rulesList) {
            rulesList.clear();
            DEFAULT_PERSONA.rules.forEach(r => rulesList.add(r));
        }

        // Switch to Dashboard
        mavo.root.children.currentPage.setValue('dashboard');
        
        // Run simulation
        setTimeout(() => window.runSimulation(), 500);
    } catch (e) {
        console.error("Error in finishInstantOnboarding:", e);
        mavo.root.children.currentPage.setValue('dashboard');
    }
};

window.calculateBalance = function(transactions) {
    const mavo = Mavo.get("vibebank");
    const initial = mavo ? parseFloat(mavo.root.children.initialBalance.value) || 0 : 0;
    
    const txArray = (transactions || []).map(t => ({
        amount: typeof t.amount === 'object' ? t.amount.value : t.amount,
        type: typeof t.type === 'object' ? t.type.value : t.type
    }));

    const balance = VibeBankCore.calculateBalance(txArray, initial);
    return VibeBankCore.formatCurrency(balance);
};

window.runSimulation = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo || !mavo.root.children.rule) return;

    const rules = (mavo.root.children.rule.children || []).map(r => ({
        ruleDescription: r.children.ruleDescription.value,
        ruleType: r.children.ruleType.value,
        ruleAmount: r.children.ruleAmount.value,
        ruleFrequency: r.children.ruleFrequency.value,
        ruleVariability: r.children.ruleVariability.value,
        ruleProbability: r.children.ruleProbability.value
    }));

    const startStr = mavo.root.children.backfillDate.value || dayjs().subtract(30, 'days').format('YYYY-MM-DD');
    const endStr = dayjs().add(30, 'days').format('YYYY-MM-DD');
    
    const newTransactions = VibeBankCore.generateTransactions(rules, startStr, endStr);
    
    const transactionsList = mavo.root.children.transactions;
    if (transactionsList) {
        newTransactions.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
        transactionsList.clear();
        newTransactions.forEach(t => transactionsList.add(t));
        
        const emptyState = document.getElementById('empty-ledger-state');
        if (emptyState) {
            emptyState.style.display = newTransactions.length === 0 ? 'block' : 'none';
        }
    }
};

window.downloadCSV = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo || !mavo.root.children.transactions) return;
    
    const transactions = mavo.root.children.transactions.children || [];
    let csv = "Date,Description,Amount,Type,Status\n";
    transactions.forEach(t => {
        const row = [
            t.children.date ? t.children.date.value : '',
            `"${t.children.description ? t.children.description.value : ''}"`,
            t.children.amount ? t.children.amount.value : '',
            t.children.type ? t.children.type.value : '',
            t.children.status ? t.children.status.value : ''
        ];
        csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'vibebank_ledger.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const DEFAULT_PERSONA = {
    accountName: "Main Checking (..4291)",
    initialBalance: 4250.32,
    rules: [
        // Income
        { ruleDescription: "Bi-Weekly Salary Payout", ruleType: "income", ruleAmount: 3250.00, ruleFrequency: "weekly", ruleVariability: 0, ruleProbability: 50 },
        { ruleDescription: "IRS Tax Refund", ruleType: "income", ruleAmount: 1200.00, ruleFrequency: "once", ruleVariability: 0, ruleProbability: 100 },
        
        // Fixed Expenses
        { ruleDescription: "Mortgage Payment (Chase)", ruleType: "expense", ruleAmount: 2150.00, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
        { ruleDescription: "Car Loan (Ford Credit)", ruleType: "expense", ruleAmount: 485.00, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
        { ruleDescription: "State Farm Insurance", ruleType: "expense", ruleAmount: 185.00, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
        { ruleDescription: "Verizon Wireless", ruleType: "expense", ruleAmount: 142.50, ruleFrequency: "monthly", ruleVariability: 5, ruleProbability: 100 },
        { ruleDescription: "Netflix / Spotify Bundle", ruleType: "expense", ruleAmount: 35.99, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
        
        // Variable Expenses
        { ruleDescription: "Kroger Groceries", ruleType: "expense", ruleAmount: 150.00, ruleFrequency: "weekly", ruleVariability: 40, ruleProbability: 100 },
        { ruleDescription: "Shell Gas Station", ruleType: "expense", ruleAmount: 45.00, ruleFrequency: "weekly", ruleVariability: 30, ruleProbability: 80 },
        { ruleDescription: "Starbucks Coffee", ruleType: "expense", ruleAmount: 7.50, ruleFrequency: "daily", ruleVariability: 20, ruleProbability: 60 },
        { ruleDescription: "Amazon Prime Purchase", ruleType: "expense", ruleAmount: 85.00, ruleFrequency: "weekly", ruleVariability: 90, ruleProbability: 40 },
        { ruleDescription: "Home Depot Project", ruleType: "expense", ruleAmount: 250.00, ruleFrequency: "monthly", ruleVariability: 80, ruleProbability: 30 }
    ]
};

const VibeBankCore = {
    calculateBalance: function(transactions, initialBalance = 0) {
        if (!transactions || !Array.isArray(transactions)) return initialBalance;
        return transactions.reduce((acc, t) => {
            const amt = parseFloat(t.amount) || 0;
            return t.type === 'income' ? acc + amt : acc - amt;
        }, initialBalance);
    },

    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD'
        }).format(amount);
    },

    generateTransactions: function(rules, startDateStr, endDateStr) {
        const start = dayjs(startDateStr).startOf('day');
        const end = dayjs(endDateStr).endOf('day');
        const today = dayjs().startOf('day');
        const transactions = [];

        let current = start;
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            rules.forEach(rule => {
                const prob = parseFloat(rule.ruleProbability) || 100;
                if (Math.random() * 100 > prob) return;

                const freq = rule.ruleFrequency || 'daily';
                let shouldOccur = false;

                if (freq === 'daily') shouldOccur = true;
                else if (freq === 'weekly' && current.day() === 1) shouldOccur = true;
                else if (freq === 'monthly' && current.date() === 1) shouldOccur = true;
                else if (freq === 'once' && current.isSame(start, 'day')) shouldOccur = true;

                if (shouldOccur) {
                    const base = parseFloat(rule.ruleAmount) || 0;
                    const variance = parseFloat(rule.ruleVariability) || 0;
                    const randomVar = (Math.random() * 2 - 1) * (variance / 100) * base;
                    const finalAmount = Math.max(0, base + randomVar);

                    transactions.push({
                        date: current.format('YYYY-MM-DD'),
                        description: rule.ruleDescription,
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

// Auto-run simulation on load if we are already on the dashboard
document.addEventListener("mavo:load", (e) => {
    const mavo = e.mavo;
    if (mavo.id === "vibebank" && mavo.root.children.currentPage.value === 'dashboard') {
        window.runSimulation();
    }
});
