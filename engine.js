const PERSONAS = {
    deadbeat: {
        accountName: "Lucky's Wallet",
        initialBalance: 50,
        rules: [
            { description: "Disability Check", type: "income", baseAmount: 850, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Online Poker", type: "expense", baseAmount: 100, frequency: "daily", variance: 80, probability: 40 },
            { description: "Rent (Double-Wide)", type: "expense", baseAmount: 450, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Gas Station Sushi", type: "expense", baseAmount: 12, frequency: "daily", variance: 50, probability: 70 },
            { description: "Pawn Shop Payday", type: "income", baseAmount: 200, frequency: "weekly", variance: 90, probability: 20 },
            { description: "Overdraft Fee", type: "expense", baseAmount: 35, frequency: "daily", variance: 0, probability: 15 }
        ]
    },
    billionaire: {
        accountName: "Bubba's Trust",
        initialBalance: 50000000,
        rules: [
            { description: "Oil Dividends", type: "income", baseAmount: 2500000, frequency: "monthly", variance: 20, probability: 100 },
            { description: "Chick-fil-a Catering", type: "expense", baseAmount: 12000, frequency: "daily", variance: 50, probability: 60 },
            { description: "Southern Baptist Tithe", type: "expense", baseAmount: 250000, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Yacht Maintenance", type: "expense", baseAmount: 75000, frequency: "monthly", variance: 30, probability: 100 },
            { description: "Private Jet Fuel", type: "expense", baseAmount: 45000, frequency: "weekly", variance: 50, probability: 80 },
            { description: "New Cattle Ranch", type: "expense", baseAmount: 12000000, frequency: "once", variance: 0, probability: 5 }
        ]
    },
    techbro: {
        accountName: "Alpha Capital",
        initialBalance: 150000,
        rules: [
            { description: "FAANG Salary", type: "income", baseAmount: 8500, frequency: "weekly", variance: 0, probability: 50 },
            { description: "RSU Vest", type: "income", baseAmount: 45000, frequency: "monthly", variance: 10, probability: 25 },
            { description: "DoorDash (Biohack Diet)", type: "expense", baseAmount: 120, frequency: "daily", variance: 30, probability: 100 },
            { description: "Equinox Membership", type: "expense", baseAmount: 350, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Crypto Dip Buying", type: "expense", baseAmount: 5000, frequency: "daily", variance: 90, probability: 15 },
            { description: "SF Micro-Studio Rent", type: "expense", baseAmount: 4200, frequency: "monthly", variance: 0, probability: 100 }
        ]
    },
    student: {
        accountName: "College Struggles",
        initialBalance: 250,
        rules: [
            { description: "FASDA Loan", type: "income", baseAmount: 12000, frequency: "once", variance: 0, probability: 100 },
            { description: "Starbucks Shift", type: "income", baseAmount: 450, frequency: "weekly", variance: 10, probability: 100 },
            { description: "Textbooks (Scam)", type: "expense", baseAmount: 800, frequency: "once", variance: 20, probability: 100 },
            { description: "Ramen Bulk Pack", type: "expense", baseAmount: 25, frequency: "weekly", variance: 10, probability: 100 },
            { description: "Shared House Rent", type: "expense", baseAmount: 900, frequency: "monthly", variance: 0, probability: 100 }
        ]
    },
    mlm: {
        accountName: "Boss Babe Bank",
        initialBalance: 1200,
        rules: [
            { description: "Husband's Salary", type: "income", baseAmount: 5000, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Essential Oil Commission", type: "income", baseAmount: 45, frequency: "monthly", variance: 90, probability: 30 },
            { description: "Inventory Restock", type: "expense", baseAmount: 499, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Target Haul", type: "expense", baseAmount: 250, frequency: "weekly", variance: 40, probability: 80 },
            { description: "Recruiting Coffee", type: "expense", baseAmount: 15, frequency: "daily", variance: 20, probability: 40 }
        ]
    },
    nomad: {
        accountName: "Global Wallet",
        initialBalance: 8500,
        rules: [
            { description: "Freelance USD", type: "income", baseAmount: 2500, frequency: "weekly", variance: 50, probability: 60 },
            { description: "Airbnb (Bali/Medellin)", type: "expense", baseAmount: 1200, frequency: "monthly", variance: 30, probability: 100 },
            { description: "Flight to Next Hub", type: "expense", baseAmount: 650, frequency: "monthly", variance: 80, probability: 100 },
            { description: "Coworking Space", type: "expense", baseAmount: 200, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Local Street Food", type: "expense", baseAmount: 5, frequency: "daily", variance: 50, probability: 100 }
        ]
    },
    grinder: {
        accountName: "Hustle Hard",
        initialBalance: 400,
        rules: [
            { description: "Uber/DoorDash Payout", type: "income", baseAmount: 180, frequency: "daily", variance: 40, probability: 90 },
            { description: "Gas Station Fill-up", type: "expense", baseAmount: 45, frequency: "daily", variance: 10, probability: 100 },
            { description: "Emergency Tire Repair", type: "expense", baseAmount: 150, frequency: "monthly", variance: 50, probability: 20 },
            { description: "Quick Energy Drink", type: "expense", baseAmount: 4.50, frequency: "daily", variance: 0, probability: 100 },
            { description: "Phone Data Overages", type: "expense", baseAmount: 30, frequency: "monthly", variance: 0, probability: 50 }
        ]
    },
    artist: {
        accountName: "Creative Soul",
        initialBalance: 600,
        rules: [
            { description: "Waitressing Tips", type: "income", baseAmount: 400, frequency: "weekly", variance: 30, probability: 100 },
            { description: "Canvas Sale", type: "income", baseAmount: 1500, frequency: "monthly", variance: 80, probability: 10 },
            { description: "Expensive Oil Paints", type: "expense", baseAmount: 250, frequency: "monthly", variance: 50, probability: 60 },
            { description: "Thrift Store Finds", type: "expense", baseAmount: 45, frequency: "weekly", variance: 70, probability: 80 },
            { description: "Loft Studio Rent", type: "expense", baseAmount: 1100, frequency: "monthly", variance: 0, probability: 100 }
        ]
    },
    soccer: {
        accountName: "Family Operational",
        initialBalance: 12500,
        rules: [
            { description: "Dual Bi-weekly Salary", type: "income", baseAmount: 6500, frequency: "weekly", variance: 0, probability: 50 },
            { description: "Costco Megarun", type: "expense", baseAmount: 650, frequency: "weekly", variance: 20, probability: 100 },
            { description: "Soccer/Gymnastics Fees", type: "expense", baseAmount: 1200, frequency: "monthly", variance: 0, probability: 100 },
            { description: "SUV Lease Payment", type: "expense", baseAmount: 750, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Home Mortgage", type: "expense", baseAmount: 3200, frequency: "monthly", variance: 0, probability: 100 },
            { description: "Amazon Prime Impulses", type: "expense", baseAmount: 85, frequency: "daily", variance: 90, probability: 30 }
        ]
    }
    // More personas can be added here following the same structure
};

function applyPersona(key) {
    const persona = PERSONAS[key];
    if (!persona) return;

    const mavo = Mavo.get("bankingSim");
    mavo.root.children.accountName.setValue(persona.accountName);
    mavo.root.children.initialBalance.setValue(persona.initialBalance);
    
    // Clear and set rules
    const rulesList = mavo.root.children.rule;
    rulesList.clear();
    persona.rules.forEach(r => rulesList.add(r));

    runSimulation();
}

function calculateBalance(transactions) {
    if (!transactions) return "$0.00";
    const mavo = Mavo.get("bankingSim");
    const initial = parseFloat(mavo.root.children.initialBalance.value) || 0;
    
    const total = transactions.reduce((acc, t) => {
        const amt = parseFloat(t.amount) || 0;
        return t.type === 'income' ? acc + amt : acc - amt;
    }, initial);

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
}

function runSimulation() {
    const mavo = Mavo.get("bankingSim");
    const rules = mavo.root.children.rule.children;
    const startStr = mavo.root.children.backfillDate.value;
    const initialBalance = parseFloat(mavo.root.children.initialBalance.value) || 0;
    
    let startDate = dayjs(startStr);
    const endDate = dayjs().add(30, 'days');
    const newTransactions = [];

    let currentDate = startDate;
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        rules.forEach(ruleData => {
            const rule = ruleData.children;
            const prob = parseFloat(rule.probability.value) || 100;
            if (Math.random() * 100 > prob) return;

            const freq = rule.frequency.value;
            let shouldOccur = false;

            if (freq === 'daily') shouldOccur = true;
            else if (freq === 'weekly' && currentDate.day() === 1) shouldOccur = true; // Mondays
            else if (freq === 'monthly' && currentDate.date() === 1) shouldOccur = true; // 1st of month
            else if (freq === 'once' && currentDate.isSame(startDate, 'day')) shouldOccur = true;

            if (shouldOccur) {
                const base = parseFloat(rule.baseAmount.value) || 0;
                const variance = parseFloat(rule.variance.value) || 0;
                const randomVar = (Math.random() * 2 - 1) * (variance / 100) * base;
                const finalAmount = Math.max(0, base + randomVar);

                newTransactions.push({
                    date: currentDate.format('YYYY-MM-DD'),
                    description: rule.description.value,
                    type: rule.type.value,
                    amount: finalAmount.toFixed(2),
                    status: currentDate.isAfter(dayjs()) ? "Scheduled" : "Cleared"
                });
            }
        });
        currentDate = currentDate.add(1, 'day');
    }

    const transactionsList = mavo.root.children.transactions;
    transactionsList.clear();
    newTransactions.forEach(t => transactionsList.add(t));
}

// Global hook for Mavo
document.addEventListener("mavo:load", () => {
    // Initial simulation if needed
});
