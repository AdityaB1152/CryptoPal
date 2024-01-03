

/*
Backend Checkpoints
1.Create Requests 
2.Pay Requests
3.Update History
4.Get personal requests
5.Get historic transactions of user
6.Create user profile in database 
*/

const express = require('express');
const ethers = require('ethers');

const app = express();
const port = 3000;

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [...];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

app.use(express.json());


// API endpoint to create payment request
app.post('/createRequest', async (req, res) => {
    try {
        
        const { userAddress, amount, message } = req.body;
        const tx = await contract.createRequest(userAddress, amount, message);
        await tx.wait();

        res.json({ success: true, message: 'Payment request created successfully' });
    }

     catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
});

// API endpoint to pay a request
app.post('/payRequest', async (req, res) => {

    try {

        const { requestIndex, amount } = req.body;
        const tx = await contract.payRequest(requestIndex, { value: ethers.utils.parseEther(amount) });

        await tx.wait();

        res.json({ success: true, message: 'Payment successful' });

    } 
    catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        
    }
});

// API endpoint to update transaction history
app.post('/updateHistory', async (req, res) => {
    try {

        const { sender, receiver, amount, message } = req.body;
        await contract.addHistory(sender, receiver, amount, message);
        res.json({ success: true, message: 'Transaction history updated successfully' });

    } 
    catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
});

// API endpoint to get personal payment requests
app.get('/getPersonalRequests/:userAddress', async (req, res) => {
    try {

        const userAddress = req.params.userAddress;
        const result = await contract.getMyRequests(userAddress);
        const [addrs, amnt, msge, nme] = result;

        const requests = addrs.map((addr, index) => ({
            requester: addr,
            amount: amnt[index],
            message: msge[index],
            name: nme[index]
        }));

        res.json({ success: true, requests });

    } 
    catch (error)
     {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// API endpoint to get historic transactions of a user
app.get('/getHistoricTransactions/:userAddress', async (req, res) => {
    try {

        const userAddress = req.params.userAddress;
        const transactions = await contract.getMyHistory(userAddress);
        res.json({ success: true, transactions });

    } 
    catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getBalance/:userAddress', async (req, res) => {

    try {

        const userAddress = req.params.userAddress;
        const balance = await provider.getBalance(userAddress);
        res.json({ success: true, balance: ethers.utils.formatEther(balance) });

    } 
    catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
});

app.get('/hasName/:userAddress', async (req, res) => {
    try {

        const userAddress = req.params.userAddress;
        const hasName = await contract.getMyName(userAddress);
        res.json({ success: true, hasName });

    } 
    catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getOwnerAddress', async (req, res) => {

    try {

        const ownerAddress = await contract.owner();
        res.json({ success: true, ownerAddress });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.listen(port, () => {

    console.log(`Server is running at http://localhost:${port}`);

});
