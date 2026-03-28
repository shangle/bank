/**
 * VibeBank POC Engine - v1.2 (Stability First)
 * Robust transaction handling with defensive checks.
 */

window.confirmTransaction = function(type) {
    const mavo = Mavo.all.vibebank;
    if (!mavo) {
        console.error("Mavo instance 'vibebank' not found.");
        return;
    }

    let description, amount, emoji, txType;

    // Grab elements by specific IDs used in index.html
    const sendToEl = document.getElementById('send-to-input');
    const sendAmountEl = document.getElementById('send-amount-input');
    const payToEl = document.getElementById('pay-to-input');
    const payAmountEl = document.getElementById('pay-amount-input');

    if (type === 'send') {
        if (!sendToEl || !sendAmountEl) {
            console.error("Send Money elements not found in DOM.");
            return;
        }
        description = sendToEl.value || "Recipient";
        amount = sendAmountEl.value || "0";
        emoji = "💸";
        txType = "expense";
    } else if (type === 'pay') {
        if (!payToEl || !payAmountEl) {
            console.error("Pay Bill elements not found in DOM.");
            return;
        }
        description = payToEl.value;
        amount = payAmountEl.value || "0";
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
                amount: `${numAmount.toFixed(2)}`, // Clean numeric string
                date: dayjs().format('MMM D'),
                categoryEmoji: emoji,
                type: txType
            });
            console.log("✅ Added transaction to collection.");
        } else {
            console.error("Transactions collection not found.");
        }

        // 2. Update Balance (Parse current string and update)
        const balanceProp = mavo.root.children.balance;
        if (balanceProp) {
            const currentBalanceStr = balanceProp.value || "$0.00";
            const currentBalance = parseFloat(currentBalanceStr.replace(/[$,]/g, '')) || 0;
            
            const newBalance = txType === 'income' ? currentBalance + numAmount : currentBalance - numAmount;
            
            balanceProp.setValue(
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(newBalance)
            );
            console.log(`✅ Balance updated: ${newBalance}`);
        }

        // 3. Reset UI State
        if (mavo.root.children.activeSheet) {
            mavo.root.children.activeSheet.setValue('none');
        }
        
        // 4. Clear Inputs
        if (sendToEl) sendToEl.value = "";
        if (sendAmountEl) sendAmountEl.value = "";
        if (payAmountEl) payAmountEl.value = "";
        
        console.log(`🚀 Transaction Success: ${txType} of ${numAmount}`);
    } catch (err) {
        console.error("❌ Transaction Failed:", err);
        alert("Something went wrong with the transaction. Check console.");
    }
};
