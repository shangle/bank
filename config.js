/**
 * Online Banking Simulator Configuration
 * 
 * Non-developers can adjust these settings to change the app's behavior.
 */
const CONFIG = {
    // Default storage backend: 'local', 'https://github.com/user/repo', or Google Sheets URL
    storage: 'local',
    
    // Google Sheets Plugin configuration (if using gsheets)
    // To use Google Sheets:
    // 1. Create a Google Sheet
    // 2. Share it (anyone with link can edit or specific users)
    // 3. Paste the URL here
    googleSheetUrl: '',

    // Simulation settings
    simulation: {
        defaultBackfillDays: 30,
        projectionDays: 30
    }
};

// Apply configuration to Mavo app on load
document.addEventListener("mavo:load", (e) => {
    const mavo = e.mavo;
    if (mavo.id === "bankingSim") {
        if (CONFIG.googleSheetUrl) {
            mavo.storage = Mavo.Storage.create(mavo, CONFIG.googleSheetUrl);
        } else if (CONFIG.storage !== 'local') {
            mavo.storage = Mavo.Storage.create(mavo, CONFIG.storage);
        }
    }
});
