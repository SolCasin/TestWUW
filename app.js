const contractAddress = '0x8e1d2158f46b6Bf0AdeF3501869817efefA1EcB6';
const contractABI = [{"inputs":[{"internalType":"uint256","name":"_ticketPrice","type":"uint256"},{"internalType":"uint256","name":"_totalTickets","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TicketPurchased","type":"event"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyTickets","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_ticketPrice","type":"uint256"}],"name":"setTicketPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_totalTickets","type":"uint256"}],"name":"setTotalTickets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketsAvailable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ticketsOwned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"}],"name":"ticketsOwnedBy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let web3;
let contract;
let account;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);

            updateUI();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.error("No Ethereum provider detected. Install MetaMask.");
    }
});

async function updateUI() {
    const totalTickets = await contract.methods.ticketsAvailable().call();
    document.getElementById('totalTickets').innerText = totalTickets;

    const yourTickets = await contract.methods.ticketsOwnedBy(account).call();
    document.getElementById('yourTickets').innerText = yourTickets;

    const priceTotal = await contract.methods.ticketPrice().call();
    priceTotal = priceTotal/10;
    document.getElementById('price').innerText = priceTotal;
    
}

document.getElementById('buyButton').addEventListener('click', async () => {
    const amount = document.getElementById('ticketAmount').value;
    const ticketPrice = await contract.methods.ticketPrice().call();

    try {
        await contract.methods.buyTickets(amount).send({ from: account, value: ticketPrice * amount });
        document.getElementById('status').innerText = "Purchase successful!";
        updateUI();
    } catch (error) {
        console.error(error);
        document.getElementById('status').innerText = "Purchase failed.";
    }
});
