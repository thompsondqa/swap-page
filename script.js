
let isWalletConnected = false;
let walletAddress = '';
let fromTokenSymbol = 'ETH';
let toTokenSymbol = 'USDC';

// Mock exchange rates
const exchangeRates = {
    'ETH-USDC': 2850,
    'USDC-ETH': 0.000351,
    'BTC-USDC': 65000,
    'USDC-BTC': 0.0000154
};

// Mock balances
const mockBalances = {
    'ETH': 1.2345,
    'USDC': 5420.50,
    'BTC': 0.0876
};

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletText = document.getElementById('walletText');
const swapBtn = document.getElementById('swapBtn');
const fromAmount = document.getElementById('fromAmount');
const toAmount = document.getElementById('toAmount');
const swapDirection = document.getElementById('swapDirection');
const fromBalance = document.getElementById('fromBalance');
const toBalance = document.getElementById('toBalance');
const exchangeRateElement = document.getElementById('exchangeRate');
const statusMessage = document.getElementById('statusMessage');

// Connect wallet functionality
connectWalletBtn.addEventListener('click', async () => {
    if (!isWalletConnected) {
        // Simulate wallet connection
        connectWalletBtn.style.opacity = '0.7';
        walletText.textContent = 'Connecting...';
        
        setTimeout(() => {
            isWalletConnected = true;
            walletAddress = '0x742d35Cc6aB4502532d4aa2e84E0c3A3a1640f29';
            connectWalletBtn.classList.add('connected');
            walletText.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
            connectWalletBtn.style.opacity = '1';
            swapBtn.disabled = false;
            swapBtn.textContent = 'Swap Tokens';
            updateBalances();
            showStatus('Wallet connected successfully!', 'success');
        }, 1500);
    } else {
        // Disconnect wallet
        isWalletConnected = false;
        walletAddress = '';
        connectWalletBtn.classList.remove('connected');
        walletText.textContent = 'Connect Wallet';
        swapBtn.disabled = true;
        swapBtn.textContent = 'Connect Wallet to Swap';
        updateBalances();
        showStatus('Wallet disconnected', 'error');
    }
});

// Swap direction
swapDirection.addEventListener('click', () => {
    const temp = fromTokenSymbol;
    fromTokenSymbol = toTokenSymbol;
    toTokenSymbol = temp;
    
    document.querySelector('#fromToken span').textContent = fromTokenSymbol;
    document.querySelector('#toToken span').textContent = toTokenSymbol;
    
    updateExchangeRate();
    updateBalances();
    calculateSwapAmount();
});

// Amount input
fromAmount.addEventListener('input', calculateSwapAmount);

// Swap button
swapBtn.addEventListener('click', () => {
    if (!isWalletConnected) return;
    
    const fromValue = parseFloat(fromAmount.value);
    if (!fromValue || fromValue <= 0) {
        showStatus('Please enter a valid amount', 'error');
        return;
    }
    
    if (fromValue > mockBalances[fromTokenSymbol]) {
        showStatus('Insufficient balance', 'error');
        return;
    }
    
    // Simulate swap transaction
    swapBtn.textContent = 'Swapping...';
    swapBtn.style.opacity = '0.7';
    
    setTimeout(() => {
        // Update balances
        mockBalances[fromTokenSymbol] -= fromValue;
        const toValue = parseFloat(toAmount.value);
        mockBalances[toTokenSymbol] += toValue;
        
        updateBalances();
        fromAmount.value = '';
        toAmount.value = '';
        
        swapBtn.textContent = 'Swap Tokens';
        swapBtn.style.opacity = '1';
        
        showStatus(`Successfully swapped ${fromValue} ${fromTokenSymbol} for ${toValue.toFixed(4)} ${toTokenSymbol}!`, 'success');
    }, 2000);
});

function calculateSwapAmount() {
    const fromValue = parseFloat(fromAmount.value);
    if (!fromValue || fromValue <= 0) {
        toAmount.value = '';
        return;
    }
    
    const rateKey = `${fromTokenSymbol}-${toTokenSymbol}`;
    const rate = exchangeRates[rateKey] || 1;
    const toValue = fromValue * rate;
    
    toAmount.value = toValue.toFixed(6);
}

function updateExchangeRate() {
    const rateKey = `${fromTokenSymbol}-${toTokenSymbol}`;
    const rate = exchangeRates[rateKey] || 1;
    exchangeRateElement.textContent = `1 ${fromTokenSymbol} = ${rate.toLocaleString()} ${toTokenSymbol}`;
}

function updateBalances() {
    if (isWalletConnected) {
        fromBalance.textContent = `Balance: ${mockBalances[fromTokenSymbol].toFixed(4)}`;
        toBalance.textContent = `Balance: ${mockBalances[toTokenSymbol].toFixed(4)}`;
    } else {
        fromBalance.textContent = 'Balance: 0.00';
        toBalance.textContent = 'Balance: 0.00';
    }
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 4000);
}

//privy integration

const { PrivyClient } = window.Privy;
// Initialize Privy client
const privy = new PrivyClient({
    appId: cmclpcfdt00vrla0mrgbdaent, // Replace with your actual App ID from Privy dashboard
    config: {
        appearance: {
            theme: 'light', // or 'dark'
            accentColor: '#676FFF',
        },
        embeddedWallets: {
            createOnLogin: 'users-without-wallets'
        }
    }
});

// DOM elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userDetails = document.getElementById('user-details');

// Event listeners
loginBtn.addEventListener('click', async () => {
    try {
        await privy.login();
    } catch (error) {
        console.error('Login failed:', error);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await privy.logout();
    } catch (error) {
        console.error('Logout failed:', error);
    }
});

// Listen for authentication state changes
privy.onAuthStateChange((user) => {
    if (user) {
        // User is logged in
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        userInfo.style.display = 'block';
        
        userDetails.innerHTML = `
            <strong>Email:</strong> ${user.email?.address || 'N/A'}<br>
            <strong>ID:</strong> ${user.id}<br>
            <strong>Wallet:</strong> ${user.wallet?.address || 'No wallet'}
        `;
    } else {
        // User is logged out
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        userInfo.style.display = 'none';
    }
});



// Initialize
updateExchangeRate();
updateBalances();
