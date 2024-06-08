document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let quizData = [];
    let userId = JSON.parse(localStorage.getItem('user'))._id;
    let testName = localStorage.getItem('test');

    // Fetch quiz questions from the server
    async function fetchQuestions() {
        try {
            const response = await fetch('/api/ans-questions');
            quizData = await response.json();
            loadQuestion(currentQuestionIndex);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    // Function to load a question
    function loadQuestion(index) {
        if (quizData.length === 0) return;
        const questionData = quizData[index];
        document.getElementById('quiz-question').textContent = `Question: ${questionData.text}`;
        document.getElementById('text_option_a').textContent = `Option 1: ${questionData.options[0]}`;
        document.getElementById('text_option_b').textContent = `Option 2: ${questionData.options[1]}`;
        document.getElementById('text_option_c').textContent = `Option 3: ${questionData.options[2]}`;
        document.getElementById('text_option_d').textContent = `Option 4: ${questionData.options[3]}`;
        document.getElementById('text_answer').textContent = `Correct answer: ${questionData.correctAnswer}`;
        fetchUserAnswer(index);
    }

    // Fetch user's answer from the server
    async function fetchUserAnswer(index) {
        try {
            const response = await fetch('/api/get-user-answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, test_name: testName })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            document.getElementById('text-user').textContent = `Your Answer: ${data.answers[index] || 'Not Attempted'}`;
        } catch (error) {
            console.error('Error fetching user answer:', error);
        }
    }

    // Load the initial question
    fetchQuestions();

    // Function to handle next button click
    document.querySelector('.next').addEventListener('click', () => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            alert("This is the last question.");
        }
    });

    // Function to handle previous button click
    document.querySelector('.previous').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        } else {
            alert("This is the first question.");
        }
    });

    // Event listeners for answer selection
    document.querySelectorAll('.quiz ul li label').forEach((label, index) => {
        label.addEventListener('click', () => {
            const answer = label.textContent.trim();
            updateUserAnswer(currentQuestionIndex, answer);
        });
    });
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
            window.location.href = "/thanks_res"; 
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