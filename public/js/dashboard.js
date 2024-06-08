const pyq = document.querySelector('.pyq');
const session = document.querySelector('.session');
const doubt = document.querySelector('.doubt');
const test = document.querySelector('.test');
const bank = document.querySelector('.bank');
const result = document.querySelector('.result');

function checkUserDetails() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('You are not logged in. Redirecting to login page...');
        window.location.href = '/login';
    }
}

checkUserDetails();

pyq.addEventListener('click',()=>{
    window.location.href="/coming";
})

session.addEventListener('click',()=>{
    window.location.href = "/coming";
})

doubt.addEventListener('click',()=>{
    window.location.href="/coming";
})

test.addEventListener('click',()=>{
    window.location.href = "/test";
})

bank.addEventListener('click',()=>{
    window.location.href="/coming";
})

result.addEventListener('click',()=>{
    window.location.href = "/result";
})
