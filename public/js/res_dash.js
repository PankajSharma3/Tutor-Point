document.addEventListener('DOMContentLoaded',()=>{
    const user = JSON.parse(localStorage.getItem('user'));
    const name = document.querySelector('h3');
    name.innerText = user.username;
});

document.addEventListener('DOMContentLoaded', async() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.error('User not found in localStorage');
        return;
    }
    const userId = user._id;
    const testName = localStorage.getItem('test');
    try {
        const response = await fetch('/api/calculate-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, test_name: testName })
        });
        if (response.ok) {
            const result = await response.json();
            let totalMarks = (result.correct*4)-result.incorrect;
            document.querySelector('.test p:nth-child(1)').textContent = `Maximum Marks: ${result.maxMarks*4 || 'N/A'}`;
            document.querySelector('.test p:nth-child(2)').textContent = `Total Correct answers: ${result.correct}`;
            document.querySelector('.test p:nth-child(3)').textContent = `Total Incorrect answers: ${result.incorrect}`;
            document.querySelector('.test p:nth-child(4)').textContent = `Total Skipped questions: ${result.skipped}`;
            document.querySelector('.test p:nth-child(5)').textContent = `Total Marks Scored: ${totalMarks || 'N/A'}`;
        } else {
            console.error('Failed to fetch results:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

const btn = document.querySelector('.btn');
btn.addEventListener('click',()=>{
    window.location.href = "/analysis";
});

function checkSubmissionStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;
    const test_name = localStorage.getItem('test');

    fetch('/api/check-submission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, test_name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.submitted != 1) {
            window.location.href = "/redirect"; 
        }
    })
    .catch(error => {
        console.error('Error checking submission status:', error);
    });
}
checkSubmissionStatus();
setInterval(checkSubmissionStatus, 1000);

function checkUserDetails() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('You are not logged in. Redirecting to login page...');
        window.location.href = '/login';
    }
}
checkUserDetails();