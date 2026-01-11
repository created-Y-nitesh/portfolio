// Minimal, 18 lines. Put in assets/js/navbar.js and include it, or paste inside <script>.
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    if (!burger || !menu) return;
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        menu.classList.toggle('open');
        // lock scroll when nav open
        if (menu.classList.contains('open')) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
    });
});