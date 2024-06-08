// Disable right-click context menu
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Disable keyboard shortcuts that might allow navigation away from the page
window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a' || e.key === 't')) {
        e.preventDefault();
    }
    if (e.key === 'F12' || e.key === 'Escape' || e.key === 'F11') {
        e.preventDefault();
    }
});

// When the user loses focus
let a = 0;
window.addEventListener("blur", () => {
    a++;
    if (a > 2) {
        submitTest();
    }
});

// Auto submit after tab switching
function submitTest() {
    alert("Your test is submitted now");
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;
    const test_name = localStorage.getItem('test');

    fetch('/api/submit-test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, test_name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Test submitted successfully') {
            localStorage.removeItem('currentQuestion');
            window.location.href = "/thanks";
        } else {
            console.error('Error submitting test:', data);
        }
    })
    .catch(error => {
        console.error('Error submitting test:', error);
    });
}

fetch('/api/questions')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(questions => {
        console.log('Fetched questions:', questions);
        localStorage.setItem('questions', JSON.stringify(questions));
        let currentQuestion = localStorage.getItem('currentQuestion') ? parseInt(localStorage.getItem('currentQuestion')) : 0;
        const question = document.getElementById("quiz-question");
        const option_a = document.getElementById("text_option_a");
        const option_b = document.getElementById("text_option_b");
        const option_c = document.getElementById("text_option_c");
        const option_d = document.getElementById("text_option_d");
        const submit = document.querySelector(".submit");
        const next = document.querySelector(".next");
        const previous = document.querySelector(".previous");

        function loadQuestion() {
            const currentQuiz = questions[currentQuestion];
            question.textContent = (currentQuestion + 1) + ". " + currentQuiz.text;
            option_a.textContent = currentQuiz.options[0];
            option_b.textContent = currentQuiz.options[1];
            option_c.textContent = currentQuiz.options[2];
            option_d.textContent = currentQuiz.options[3];
            document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
        }
        loadQuestion();

        submit.addEventListener("click", () => {
            const checkedAns = document.querySelector('input[type="radio"]:checked');
            if (checkedAns === null) {
                alert("Please select an answer");
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                const answer = checkedAns.nextElementSibling.textContent;
                const userId = user._id;
                const test_name = localStorage.getItem('test');
                fetch('/api/update-answer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, questionIndex: currentQuestion, answer ,test_name})
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Answer updated successfully') {
                        currentQuestion++;
                        if (currentQuestion < questions.length) {
                            loadQuestion();
                            localStorage.setItem('currentQuestion', currentQuestion);
                        } else {
                            submitTest();
                        }
                    }
                })
                .catch(error => {
                    console.error('Error updating answer:', error);
                });
            }
        });
        next.addEventListener("click", () => {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                loadQuestion();
                localStorage.setItem('currentQuestion', currentQuestion);
            } else {
                if (confirm("You are on the last question. Do you want to submit the test?")) {
                    submitTest();
                } else {
                    alert("This is the last question.");
                }
            }
        });
        previous.addEventListener("click", () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
                localStorage.setItem('currentQuestion', currentQuestion);
            } else {
                alert("This is the first question.");
            }
        });
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
    });

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
checkUserDetails();
checkSubmissionStatus();
setInterval(checkSubmissionStatus, 1000);
