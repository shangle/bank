/**
 * VibeBank POC Engine - v1.1
 * Handles interaction logic for the clean POC dashboard.
 */

window.confirmTransaction = function(type) {
    const mavo = Mavo.get("vibebank");
    if (!mavo) return;

    let description, amount, emoji, txType;

    if (type === 'send') {
        description = document.getElementById('send-to').value || "Recipient";
        amount = document.getElementById('send-amount').value || "0";
        emoji = "💸";
        txType = "expense";
    } else if (type === 'pay') {
        description = document.getElementById('pay-to').value;
        amount = document.getElementById('pay-amount').value || "0";
        emoji = "🧾";
        txType = "expense";
    } else if (type === 'request') {
        description = "Request from User";
        amount = "0"; // Logic for request would be different
        emoji = "📩";
        txType = "income";
    }

    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Add to Mavo Transactions
    const txList = mavo.root.children.transactions;
    if (txList) {
        txList.add({
            description: description,
            amount: `${txType === 'income' ? '+' : '-'} $${parseFloat(amount).toFixed(2)}`,
            date: dayjs().format('MMM D'),
            categoryEmoji: emoji,
            type: txType
        });
    }

    // Simple Balance Update Logic
    const currentBalanceStr = mavo.root.children.balance.value;
    const currentBalance = parseFloat(currentBalanceStr.replace(/[$,]/g, ''));
    const newBalance = txType === 'income' ? currentBalance + parseFloat(amount) : currentBalance - parseFloat(amount);
    
    mavo.root.children.balance.setValue(
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(newBalance)
    );

    // Close Sheet
    mavo.root.children.activeSheet.setValue('none');
    
    // Clear Inputs
    if (document.getElementById('send-to')) document.getElementById('send-to').value = "";
    if (document.getElementById('send-amount')) document.getElementById('send-amount').value = "";
    if (document.getElementById('pay-amount')) document.getElementById('pay-amount').value = "";
};
