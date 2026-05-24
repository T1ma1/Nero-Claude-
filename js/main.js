/* ============================================
   NERO Decor Studio — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 800);
    });
    // Fallback: hide preloader after 3s
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 3000);

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Burger / Mobile Menu ---
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Reveal on Scroll (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Parallax Effect on Hero ---
    const heroParallax = document.querySelector('.hero-parallax');
    if (heroParallax) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroParallax.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    // --- Paint Splashes Canvas ---
    const canvas = document.getElementById('paint-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class PaintParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.15 + 0.02;
                this.life = Math.random() * 300 + 200;
                this.maxLife = this.life;
                // Gold/beige tones
                const colors = [
                    'rgba(201, 169, 110,',
                    'rgba(223, 192, 138,',
                    'rgba(168, 136, 77,',
                    'rgba(240, 212, 138,',
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;

                if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                const fadeRatio = this.life / this.maxLife;
                const alpha = this.opacity * fadeRatio;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + alpha + ')';
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new PaintParticle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animateParticles);
        }

        // Only animate when hero is visible
        const heroSection = document.getElementById('hero');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateParticles();
                } else {
                    cancelAnimationFrame(animationId);
                }
            });
        }, { threshold: 0 });

        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }

    // --- Paint Brush Animation (decorative floating brush strokes) ---
    function createBrushStroke() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const stroke = document.createElement('div');
        stroke.style.cssText = `
            position: absolute;
            width: ${Math.random() * 100 + 50}px;
            height: ${Math.random() * 4 + 1}px;
            background: linear-gradient(90deg, transparent, rgba(201, 169, 110, ${Math.random() * 0.08 + 0.02}), transparent);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 1;
            animation: brushFade ${Math.random() * 4 + 3}s ease-in-out forwards;
        `;
        hero.appendChild(stroke);
        setTimeout(() => stroke.remove(), 7000);
    }

    // Add brush stroke animation keyframes
    const brushStyle = document.createElement('style');
    brushStyle.textContent = `
        @keyframes brushFade {
            0% { opacity: 0; transform: rotate(var(--r, 0deg)) scaleX(0); }
            30% { opacity: 1; transform: rotate(var(--r, 0deg)) scaleX(1); }
            100% { opacity: 0; transform: rotate(var(--r, 0deg)) scaleX(1.2); }
        }
    `;
    document.head.appendChild(brushStyle);

    // Create brush strokes periodically
    setInterval(createBrushStroke, 3000);

    // --- Active Nav Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });

    // Add active style
    const navActiveStyle = document.createElement('style');
    navActiveStyle.textContent = `.nav-link.active { color: var(--accent); } .nav-link.active::after { width: 100%; }`;
    document.head.appendChild(navActiveStyle);

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }

            // Simulate form submission
            const btn = contactForm.querySelector('.btn-submit');
            btn.innerHTML = '<span>Отправка...</span>';
            btn.disabled = true;

            setTimeout(() => {
                showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
                btn.innerHTML = `<span>Отправить</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
                btn.disabled = false;
            }, 1500);
        });
    }

    // --- Notification System ---
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '&#10003;' : '&#10007;'}</span>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            z-index: 10000;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: var(--font-body);
            font-size: 0.9rem;
            animation: notifSlide 0.4s ease;
            background: ${type === 'success' ? 'rgba(201, 169, 110, 0.95)' : 'rgba(200, 60, 60, 0.95)'};
            color: ${type === 'success' ? '#0a0a0a' : '#fff'};
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notification);

        // Add animation
        if (!document.getElementById('notif-style')) {
            const notifStyle = document.createElement('style');
            notifStyle.id = 'notif-style';
            notifStyle.textContent = `
                @keyframes notifSlide {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-icon {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(notifStyle);
        }

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // --- Phone Input Mask ---
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                let formatted = '+7';
                if (value.length > 0) formatted += ' (' + value.substring(0, 3);
                if (value.length > 3) formatted += ') ' + value.substring(3, 6);
                if (value.length > 6) formatted += '-' + value.substring(6, 8);
                if (value.length > 8) formatted += '-' + value.substring(8, 10);
                e.target.value = formatted;
            }
        });
    }

    // --- Counter Animation for Facts ---
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let current = 0;
                    const increment = target / 60;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 16);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counter);
    });

    // --- Cursor Paint Trail (desktop only) ---
    if (window.innerWidth > 1024) {
        let mouseTrailActive = false;
        const hero = document.querySelector('.hero');

        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                if (mouseTrailActive) return;
                mouseTrailActive = true;

                const dot = document.createElement('div');
                dot.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 6 + 2}px;
                    height: ${Math.random() * 6 + 2}px;
                    background: rgba(201, 169, 110, ${Math.random() * 0.3 + 0.1});
                    border-radius: 50%;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    pointer-events: none;
                    z-index: 3;
                    transition: all 1s ease;
                `;
                document.body.appendChild(dot);

                requestAnimationFrame(() => {
                    dot.style.opacity = '0';
                    dot.style.transform = `scale(3) translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`;
                });

                setTimeout(() => dot.remove(), 1000);
                setTimeout(() => mouseTrailActive = false, 50);
            });
        }
    }

});
