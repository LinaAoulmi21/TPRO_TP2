document.getElementById('startInput').addEventListener('click', function() {  
    const numItems = parseInt(document.getElementById('numItems').value);  
    if (numItems > 0) {  
        document.getElementById('itemInputForm').style.display = 'block';  
        this.disabled = true; // Disable the start button after starting the input  
    }  
});  

const items = [];  

document.getElementById('addItem').addEventListener('click', function() {  
    const weight = parseInt(document.getElementById('weight').value);  
    const gain = parseInt(document.getElementById('gain').value);  

    if (weight > 0 && gain > 0) {  
        items.push({ weight, gain });  
        displayItems();  
        document.getElementById('weight').value = '';  
        document.getElementById('gain').value = '';  
    }  
});  

function displayItems() {  
    const itemList = document.getElementById('itemList');  
    itemList.innerHTML = ''; // Clear existing items  
    items.forEach((item) => {  
        const ball = document.createElement('div');  
        ball.className = 'ball';  
        ball.innerText = `W:${item.weight}\nG:${item.gain}`;  
        itemList.appendChild(ball);  
    });  
}  

document.getElementById('runAlgorithm').addEventListener('click', function() {  
    const maxWeight = parseInt(document.getElementById('maxWeight').value);  
    const weights = items.map(item => item.weight);  
    const gains = items.map(item => item.gain);  
    
    if (weights.length > 0 && maxWeight > 0) {  
        const result = knapsack(weights, gains, maxWeight);  
        displayResult(result, weights, gains);  
    }  
});  

function knapsack(weights, gains, maxWeight) {  
    const n = weights.length;  
    const dp = Array.from({ length: n + 1 }, () => Array(maxWeight + 1).fill(0));  

    for (let i = 1; i <= n; i++) {  
        for (let w = 0; w <= maxWeight; w++) {  
            if (weights[i - 1] <= w) {  
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + gains[i - 1]);  
            } else {  
                dp[i][w] = dp[i - 1][w];  
            }  
        }  
    }  

    const selectedItems = [];  
    let w = maxWeight;  

    for (let i = n; i > 0; i--) {  
        if (dp[i][w] !== dp[i - 1][w]) {  
            selectedItems.push(i - 1);  
            w -= weights[i - 1];  
        }  
    }  

    return {  
        maxGain: dp[n][maxWeight],  
        selectedItems: selectedItems.reverse(),  
    };  
}  

function displayResult(result, weights, gains) {  
    const resultDiv = document.getElementById('result');  
    resultDiv.innerHTML = ''; // Clear previous results  

    // Create a container for selected items  
    const selectedContainer = document.createElement('div');  
    selectedContainer.className = 'item-list'; // Use the same styles as the item list  

    // Display the maximum gain  
    let output = `Maximum Gain: ${result.maxGain}<br>`;  
    resultDiv.innerHTML += output;  

    if (result.selectedItems.length === 0) {  
        resultDiv.innerHTML += "No items selected.";  
    } else {  
        resultDiv.innerHTML += "Selected Items:<br>";  
        result.selectedItems.forEach(index => {  
            const ball = document.createElement('div');  
            ball.className = 'ball selected-ball'; // Different class for selected items  
            ball.innerText = `W:${weights[index]}\nG:${gains[index]}`;  
            selectedContainer.appendChild(ball);  
        });  
        resultDiv.appendChild(selectedContainer); // Append the selected items to the result  
    }  
}