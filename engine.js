/**
 * VibeBank POC Engine - v1.2 (Stability First)
 * Handles interaction logic with zero-error enforcement.
 */

window.confirmTransaction = function(type) {
    const mavo = Mavo.all.vibebank;
    if (!mavo) {
        console.error("Mavo instance 'vibebank' not found.");
        return;
    }

    let description, amount, emoji, txType;

    // Grab elements by specific IDs used in index.html
    if (type === 'send') {
        description = document.getElementById('send-to-input').value || "Recipient";
        amount = document.getElementById('send-amount-input').value || "0";
        emoji = "💸";
        txType = "expense";
    } else if (type === 'pay') {
        description = document.getElementById('pay-to-input').value;
        amount = document.getElementById('pay-amount-input').value || "0";
        emoji = "🧾";
        txType = "expense";
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        // 1. Add to the Mavo Transactions List
        const transactionsList = mavo.root.children.transactions;
        if (transactionsList) {
            transactionsList.add({
                description: description,
                amount: `${numAmount.toFixed(2)}`, // Store as clean number for property
                date: dayjs().format('MMM D'),
                categoryEmoji: emoji,
                type: txType
            });
        }

        // 2. Update Balance (Parse current string and update)
        const balanceProp = mavo.root.children.balance;
        const currentBalanceStr = balanceProp.value || "$0.00";
        const currentBalance = parseFloat(currentBalanceStr.replace(/[$,]/g, '')) || 0;
        
        const newBalance = txType === 'income' ? currentBalance + numAmount : currentBalance - numAmount;
        
        balanceProp.setValue(
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(newBalance)
        );

        // 3. Reset UI State
        mavo.root.children.activeSheet.setValue('none');
        
        // 4. Clear Inputs
        if (document.getElementById('send-to-input')) document.getElementById('send-to-input').value = "";
        if (document.getElementById('send-amount-input')) document.getElementById('send-amount-input').value = "";
        if (document.getElementById('pay-amount-input')) document.getElementById('pay-amount-input').value = "";
        
        console.log(`✅ Transaction Success: ${txType} of ${numAmount}`);
    } catch (err) {
        console.error("❌ Transaction Failed:", err);
    }
};
