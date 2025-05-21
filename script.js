document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    let nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // LAB ONLY 密码验证
    const labOnlyLink = document.querySelector('a[href="lab-only.html"]');
    if (labOnlyLink) {
        labOnlyLink.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认跳转
            
            const password = prompt('请输入访问密码：');
            if (password === '2024') {
                window.location.href = 'lab-only.html';
            } else {
                alert('密码错误！');
            }
        });
    }

    // 如果在 lab-only.html 页面，验证是否通过密码访问
    if (window.location.pathname.includes('lab-only.html')) {
        // 获取会话存储中的验证状态
        const isAuthenticated = sessionStorage.getItem('labAuthenticated');
        
        if (!isAuthenticated) {
            const password = prompt('请输入访问密码：');
            if (password === '2024') {
                sessionStorage.setItem('labAuthenticated', 'true');
            } else {
                alert('密码错误！');
                window.location.href = 'index.html'; // 重定向到首页
            }
        }
    }

    // 图片轮播功能（如果存在）
    if (document.querySelector('.slider-container')) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        
        function showSlide(n) {
            slides.forEach(slide => slide.style.display = 'none');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].style.display = 'block';
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // 每5秒切换一次图片
        setInterval(nextSlide, 5000);
        showSlide(0);
    }
}); 