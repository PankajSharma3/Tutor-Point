function checkUserDetails() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('You are not logged in. Redirecting to login page...');
        window.location.href = '/login';
    }
}
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
        if (data.submitted === 1) {
            window.location.href = "/thanks"; 
        }
    })
    .catch(error => {
        console.error('Error checking submission status:', error);
    });
}
checkSubmissionStatus();
setInterval(checkSubmissionStatus, 1000);
checkUserDetails();