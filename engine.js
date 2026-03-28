/**
 * VibeBank Simulation Engine - "Average Joe" Edition
 * Apple/M3 Design Evolution Logic
 */

window.startInstantOnboarding = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo) return;
    
    mavo.root.children.currentPage.setValue('onboarding');
    
    const updateProgress = (pct, text) => {
        const progressBar = document.getElementById('progress-bar');
        const verificationText = document.getElementById('verification-text');
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (verificationText) verificationText.innerText = text;
    };

    setTimeout(() => updateProgress(35, 'Scanning financial DNA...'), 400);
    setTimeout(() => updateProgress(70, 'Mapping synthetic history...'), 1200);
    setTimeout(() => updateProgress(100, 'Reality established.'), 2000);

    setTimeout(() => {
        window.finishInstantOnboarding();
    }, 2500);
};

window.finishInstantOnboarding = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo) return;
    
    console.log("🚀 Initializing Average Joe Persona...");
    
    try {
        // Core Properties
        mavo.root.children.accountName.setValue("Main Checking (..4291)");
        mavo.root.children.initialBalance.setValue(4250.32);
        
        if (mavo.root.children.backfillDate) {
            mavo.root.children.backfillDate.setValue(dayjs().subtract(30, 'days').format('YYYY-MM-DD'));
        }
        
        // Populate Rules
        const rulesList = mavo.root.children.rule;
        if (rulesList) {
            rulesList.clear();
            const rules = [
                { ruleDescription: "Bi-Weekly Salary Payout", ruleType: "income", ruleAmount: 3250.00, ruleFrequency: "weekly", ruleVariability: 0, ruleProbability: 50 },
                { ruleDescription: "IRS Tax Refund", ruleType: "income", ruleAmount: 1200.00, ruleFrequency: "once", ruleVariability: 0, ruleProbability: 100 },
                { ruleDescription: "Mortgage Payment (Chase)", ruleType: "expense", ruleAmount: 2150.00, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
                { ruleDescription: "Car Loan (Ford Credit)", ruleType: "expense", ruleAmount: 485.00, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
                { ruleDescription: "Kroger Groceries", ruleType: "expense", ruleAmount: 150.00, ruleFrequency: "weekly", ruleVariability: 40, ruleProbability: 100 },
                { ruleDescription: "Amazon Prime", ruleType: "expense", ruleAmount: 85.00, ruleFrequency: "weekly", ruleVariability: 90, ruleProbability: 40 }
            ];
            rules.forEach(r => rulesList.add(r));
            console.log("✅ Rules injected.");
        }

        mavo.root.children.currentPage.setValue('dashboard');
        
        // Initial simulation
        setTimeout(() => window.runSimulation(), 800);
    } catch (e) {
        console.error("❌ Onboarding Error:", e);
        mavo.root.children.currentPage.setValue('dashboard');
    }
};

window.calculateBalance = function(transactions) {
    const mavo = Mavo.get("vibebank");
    if (!mavo) return "$0.00";
    
    const initial = parseFloat(mavo.root.children.initialBalance.value) || 0;
    
    // Convert Mavo collection to usable array
    const txList = transactions || [];
    const total = txList.reduce((acc, t) => {
        const amt = parseFloat(t.amount) || 0;
        const type = t.type || 'expense';
        return type === 'income' ? acc + amt : acc - amt;
    }, initial);

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
};

window.runSimulation = function() {
    const mavo = Mavo.get("vibebank");
    if (!mavo || !mavo.root.children.rule) return;

    console.log("🔄 Running Simulation Engine...");

    const rules = (mavo.root.children.rule.children || []).map(r => ({
        ruleDescription: r.children.ruleDescription.value,
        ruleType: r.children.ruleType.value,
        ruleAmount: r.children.ruleAmount.value,
        ruleFrequency: r.children.ruleFrequency.value,
        ruleVariability: r.children.ruleVariability.value,
        ruleProbability: 100 // Default to 100 for Average Joe
    }));

    const startStr = mavo.root.children.backfillDate.value || dayjs().subtract(30, 'days').format('YYYY-MM-DD');
    const endStr = dayjs().add(30, 'days').format('YYYY-MM-DD');
    
    const newTransactions = VibeBankCore.generateTransactions(rules, startStr, endStr);
    
    const transactionsList = mavo.root.children.transactions;
    if (transactionsList) {
        newTransactions.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
        transactionsList.clear();
        newTransactions.forEach(t => transactionsList.add(t));
        console.log(`✅ Simulation complete. ${newTransactions.length} transactions generated.`);
        
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
            t.children.date.value,
            `"${t.children.description.value}"`,
            t.children.amount.value,
            t.children.type.value,
            t.children.status.value
        ];
        csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'vibebank_history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const VibeBankCore = {
    generateTransactions: function(rules, startDateStr, endDateStr) {
        const start = dayjs(startDateStr).startOf('day');
        const end = dayjs(endDateStr).endOf('day');
        const today = dayjs().startOf('day');
        const transactions = [];

        let current = start;
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            rules.forEach(rule => {
                if (!rule.ruleDescription) return;

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

document.addEventListener("mavo:load", (e) => {
    const mavo = e.mavo;
    if (mavo.id === "vibebank" && mavo.root.children.currentPage.value === 'dashboard') {
        window.runSimulation();
    }
});
