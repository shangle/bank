/**
 * VibeBank Simulation Engine
 * Core logic for backfilling, projecting, and handling UI transitions.
 */

const PERSONAS = {
    deadbeat: {
        accountName: "Lucky's Wallet",
        initialBalance: 50,
        rules: [
            { ruleDescription: "Disability Check", ruleType: "income", ruleAmount: 850, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
            { ruleDescription: "Online Poker", ruleType: "expense", ruleAmount: 100, ruleFrequency: "daily", ruleVariability: 80, ruleProbability: 40 },
            { ruleDescription: "Rent (Double-Wide)", ruleType: "expense", ruleAmount: 450, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
            { ruleDescription: "Gas Station Sushi", ruleType: "expense", ruleAmount: 12, ruleFrequency: "daily", ruleVariability: 50, ruleProbability: 70 },
            { ruleDescription: "Pawn Shop Payday", ruleType: "income", ruleAmount: 200, ruleFrequency: "weekly", ruleVariability: 90, ruleProbability: 20 },
            { ruleDescription: "Overdraft Fee", ruleType: "expense", ruleAmount: 35, ruleFrequency: "daily", ruleVariability: 0, ruleProbability: 15 }
        ]
    },
    billionaire: {
        accountName: "Bubba's Trust",
        initialBalance: 50000000,
        rules: [
            { ruleDescription: "Oil Dividends", ruleType: "income", ruleAmount: 2500000, ruleFrequency: "monthly", ruleVariability: 20, ruleProbability: 100 },
            { ruleDescription: "Chick-fil-a Catering", ruleType: "expense", ruleAmount: 12000, ruleFrequency: "daily", ruleVariability: 50, ruleProbability: 60 },
            { ruleDescription: "Southern Baptist Tithe", ruleType: "expense", ruleAmount: 250000, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
            { ruleDescription: "Yacht Maintenance", ruleType: "expense", ruleAmount: 75000, ruleFrequency: "monthly", ruleVariability: 30, ruleProbability: 100 },
            { ruleDescription: "Private Jet Fuel", ruleType: "expense", ruleAmount: 45000, ruleFrequency: "weekly", ruleVariability: 50, ruleProbability: 80 }
        ]
    },
    techbro: {
        accountName: "Alpha Capital",
        initialBalance: 150000,
        rules: [
            { ruleDescription: "FAANG Salary", ruleType: "income", ruleAmount: 8500, ruleFrequency: "weekly", ruleVariability: 0, ruleProbability: 50 },
            { ruleDescription: "RSU Vest", ruleType: "income", ruleAmount: 45000, ruleFrequency: "monthly", ruleVariability: 10, ruleProbability: 25 },
            { ruleDescription: "DoorDash", ruleType: "expense", ruleAmount: 120, ruleFrequency: "daily", ruleVariability: 30, ruleProbability: 100 },
            { ruleDescription: "Equinox Membership", ruleType: "expense", ruleAmount: 350, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 },
            { ruleDescription: "Crypto Dip Buying", ruleType: "expense", ruleAmount: 5000, ruleFrequency: "daily", ruleVariability: 90, ruleProbability: 15 },
            { ruleDescription: "SF Micro-Studio Rent", ruleType: "expense", ruleAmount: 4200, ruleFrequency: "monthly", ruleVariability: 0, ruleProbability: 100 }
        ]
    }
};

let selectedPersonaKey = null;

// The "Performance Art" Verification Flow
function selectPersona(key) {
    selectedPersonaKey = key;
    const mavo = Mavo.get("vibebank");
    
    // Move to step 2 (Verification)
    mavo.root.children.onboardingStep.value = 2;
    
    // Simulate complex background checks
    setTimeout(() => {
        document.getElementById('progress-bar').style.width = '30%';
        document.getElementById('verification-text').innerText = 'Analyzing fictional credit score...';
    }, 100);

    setTimeout(() => {
        document.getElementById('progress-bar').style.width = '70%';
        document.getElementById('verification-text').innerText = 'Validating non-existent identity documents...';
    }, 1500);

    setTimeout(() => {
        document.getElementById('progress-bar').style.width = '100%';
        document.getElementById('verification-text').innerText = 'Identity secured. Preparing account...';
    }, 2500);

    setTimeout(() => {
        // Move to step 3 (Initial Deposit)
        mavo.root.children.onboardingStep.value = 3;
        
        // Pre-fill initial balance based on persona
        if (PERSONAS[key]) {
            mavo.root.children.initialBalance.value = PERSONAS[key].initialBalance;
        }
    }, 3500);
}

function finishOnboarding() {
    const mavo = Mavo.get("vibebank");
    
    if (selectedPersonaKey && PERSONAS[selectedPersonaKey]) {
        const persona = PERSONAS[selectedPersonaKey];
        mavo.root.children.accountName.value = persona.accountName;
        
        const rulesList = mavo.root.children.rule;
        rulesList.clear();
        
        // Add rules sequentially
        persona.rules.forEach(r => {
            const newItem = rulesList.add();
            // Need small delay for Mavo to render the new item before setting values
            setTimeout(() => {
                if(newItem.children.ruleDescription) newItem.children.ruleDescription.value = r.ruleDescription;
                if(newItem.children.ruleType) newItem.children.ruleType.value = r.ruleType;
                if(newItem.children.ruleAmount) newItem.children.ruleAmount.value = r.ruleAmount;
                if(newItem.children.ruleFrequency) newItem.children.ruleFrequency.value = r.ruleFrequency;
                if(newItem.children.ruleVariability) newItem.children.ruleVariability.value = r.ruleVariability;
                if(newItem.children.ruleProbability) newItem.children.ruleProbability.value = r.ruleProbability;
            }, 50);
        });
    }

    // Go to dashboard
    mavo.root.children.currentPage.value = 'dashboard';
    
    // Run simulation automatically
    setTimeout(() => runSimulation(), 500);
}

function calculateBalance(transactions) {
    if (!transactions || transactions.length === 0) return "$0.00";
    
    const mavo = Mavo.get("vibebank");
    if(!mavo) return "$0.00";
    
    let initial = 0;
    try {
        initial = parseFloat(mavo.root.children.initialBalance.value) || 0;
    } catch(e) {}
    
    const total = transactions.reduce((acc, t) => {
        const amt = parseFloat(t.amount) || 0;
        return t.type === 'income' ? acc + amt : acc - amt;
    }, initial);

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
}

function runSimulation() {
    const mavo = Mavo.get("vibebank");
    if (!mavo || !mavo.root.children.rule || !mavo.root.children.rule.children) return;

    const rules = mavo.root.children.rule.children;
    const startStr = mavo.root.children.backfillDate.value || dayjs().subtract(30, 'days').format('YYYY-MM-DD');
    
    let startDate = dayjs(startStr);
    const endDate = dayjs().add(30, 'days');
    const newTransactions = [];

    let currentDate = startDate;
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        rules.forEach(ruleData => {
            if(!ruleData.children) return;
            const rule = ruleData.children;
            
            // Skip empty rules
            if(!rule.ruleDescription || !rule.ruleDescription.value) return;

            const prob = parseFloat(rule.ruleProbability ? rule.ruleProbability.value : 100) || 100;
            if (Math.random() * 100 > prob) return;

            const freq = rule.ruleFrequency ? rule.ruleFrequency.value : 'daily';
            let shouldOccur = false;

            if (freq === 'daily') shouldOccur = true;
            else if (freq === 'weekly' && currentDate.day() === 1) shouldOccur = true;
            else if (freq === 'monthly' && currentDate.date() === 1) shouldOccur = true;
            else if (freq === 'once' && currentDate.isSame(startDate, 'day')) shouldOccur = true;

            if (shouldOccur) {
                const base = parseFloat(rule.ruleAmount ? rule.ruleAmount.value : 0) || 0;
                const variance = parseFloat(rule.ruleVariability ? rule.ruleVariability.value : 0) || 0;
                const randomVar = (Math.random() * 2 - 1) * (variance / 100) * base;
                const finalAmount = Math.max(0, base + randomVar);

                newTransactions.push({
                    date: currentDate.format('YYYY-MM-DD'),
                    description: rule.ruleDescription.value,
                    type: rule.ruleType ? rule.ruleType.value : 'expense',
                    amount: finalAmount.toFixed(2),
                    status: currentDate.isAfter(dayjs()) ? "Scheduled" : "Cleared"
                });
            }
        });
        currentDate = currentDate.add(1, 'day');
    }

    const transactionsList = mavo.root.children.transactions;
    if(transactionsList) {
        transactionsList.clear();
        newTransactions.forEach(t => transactionsList.add(t));
    }
}

function downloadCSV() {
    const mavo = Mavo.get("vibebank");
    if (!mavo || !mavo.root.children.transactions) return;
    
    const transactions = mavo.root.children.transactions.children;
    
    let csv = "Date,Description,Amount,Type,Status\n";
    transactions.forEach(t => {
        if(!t.children) return;
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
}
