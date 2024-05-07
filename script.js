document.getElementById('mortgage_form').addEventListener('submit', function(e) {
    e.preventDefault();

    // If checkbox is not checked users are not allowed to continue
    const data_checkbox = document.getElementById('data_checkbox').checked;
    if (!data_checkbox) {
        alert("Please allow the use of your data to calculate.");
        return;
    }
    // Calling user input from the HTML form
    const housePrice = parseFloat(document.getElementById('house_price').value);
    const deposit = parseFloat(document.getElementById('deposit').value);
    const interest_rate = parseFloat(document.getElementById('interest_rate').value) / 100;
    const mortgage_term = parseFloat(document.getElementById('mortgage_term').value);
    // Calculating mortgage and its monthly payments
    const loan_amount = housePrice - deposit;
    const monthly_interest_rate = interest_rate / 12;
    const total_payments = mortgage_term * 12;
    const monthly_payment = loan_amount * monthly_interest_rate / (1 - Math.pow(1 + monthly_interest_rate, -total_payments));
    // Displaying results from the calculation 
    const result = document.getElementById('result');
    result.innerHTML = `
      <h2>Mortgage Details</h2>
      <p>Loan Amount: £${loan_amount.toFixed(2)}</p>
      <p>Monthly Payment: £${monthly_payment.toFixed(2)}</p>
    `;
    // Creating the chart
    create_chart(loan_amount, monthly_interest_rate, total_payments, monthly_payment);
});
function create_chart(loan_amount, monthly_interest_rate, total_payments, monthly_payment) {
    const ctx = document.getElementById('payment_chart').getContext('2d');
    // STore data as arrays
    const labels = Array.from({ length: total_payments }, (_, i) => i + 1);
    const principal_data = [];
    const interest_data = [];
    const balance_data = [];
    // Calculating principal payment, interest payment, and remaining balance for each month
    let balance = loan_amount;
    for (let i = 0; i < total_payments; i++) {
        // Calculate interest payment
        const interest_payment = balance * monthly_interest_rate;
        // Calculate principal payment
        const principal_payment = monthly_payment - interest_payment;
        // Update balance
        balance -= principal_payment;
        // Store data for the current month
        principal_data.push(principal_payment.toFixed(2));
        interest_data.push(interest_payment.toFixed(2));
        balance_data.push(balance.toFixed(2));
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            // Label the datasets for the graph
            datasets: [
                {
                    label: 'Principal Payment',
                    data: principal_data,
                    // Set colour blue
                    backgroundColor: 'blue'
                },
                {
                    label: 'Interest Payment',
                    data: interest_data,
                    // Set colour red
                    backgroundColor: 'red'
                },
                {
                    label: 'Balance',
                    data: balance_data,
                    // Set colour green
                    backgroundColor: 'green'
                }
                // Different colours allows for easy visualization 
            ]
        },
        options: {
            // Title of the graph
            title: {
                display: true,
                text: 'Monthly Payments and Balance'
            },
            scales: {
                // Label for the Y axis
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Amount (£)'
                    }
                }],
                // Label for the X axis
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }]
            }
        }
    });
}