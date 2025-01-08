document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const main = document.querySelector('main');

    // 主题切换功能
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // 加载文章内容
    async function loadArticle(path) {
        try {
            const response = await fetch(path);
            const markdown = await response.text();
            const content = marked.parse(markdown);
            main.innerHTML = `<article class="post full-post">${content}</article>`;
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading article:', error);
        }
    }

    // 处理文章链接点击
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            const articlePath = e.target.getAttribute('href');
            loadArticle(articlePath);
            history.pushState(null, '', articlePath);
        }
    });

    // 处理浏览器后退/前进
    window.addEventListener('popstate', () => {
        if (location.pathname === '/') {
            location.reload();
        } else {
            loadArticle(location.pathname);
        }
    });

    // 文章卡片动画
    const posts = document.querySelectorAll('.post');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    posts.forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(post);
    });
});