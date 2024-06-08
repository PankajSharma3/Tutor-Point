const card = document.querySelector('.card');
const test = document.querySelector('h3');
card.addEventListener('click',()=>{
    localStorage.setItem('test',test.innerHTML);
    window.location.href = "/instruction";
})

function checkUserDetails() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('You are not logged in. Redirecting to login page...');
        window.location.href = '/login';
    }
}
checkUserDetails();