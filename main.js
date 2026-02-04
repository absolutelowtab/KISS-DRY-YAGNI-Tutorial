// ================== ИНИЦИАЛИЗАЦИЯ ЧАСТИЦ ==================
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем частицы
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('Частицы загружены!');
        });
    }

    // Анимация заголовка
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.main-title',
            translateY: [-30, 0],
            opacity: [0, 1],
            duration: 1500,
            easing: 'easeOutExpo'
        });
    }

    // Анимация бейджей
    setTimeout(() => {
        document.querySelectorAll('.principle-badges .badge').forEach((badge, index) => {
            anime({
                targets: badge,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 800,
                delay: index * 200,
                easing: 'easeOutBack'
            });
        });
    }, 500);

    // Инициализация всех компонентов
    initNavigation();
    initHints();
    initChecklist();
    initCards();
    initTestModal();
    initScrollToTop();
    initCheatsheetsObserver();
    restoreProgress();
});

// ================== ПЛАВНАЯ НАВИГАЦИЯ ==================
function initNavigation() {
    // Клик по навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            // Если это модальное окно теста
            if (href === '#testModal') {
                e.preventDefault();
                showTestModal();
                return;
            }
            
            // Плавный скролл к секциям
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Обновляем активную ссылку
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Скролл
                window.scrollTo({
                    top: targetElement.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Обновление активной ссылки при скролле
    const sections = document.querySelectorAll('.principle-section, .cheatsheets-section, .practice-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ================== ПОДСКАЗКИ ==================
function initHints() {
    document.querySelectorAll('.btn-hint').forEach(button => {
        button.addEventListener('click', function() {
            const hintId = this.getAttribute('data-hint');
            const hintContent = document.getElementById(`hint-${hintId}`);
            
            if (hintContent.classList.contains('active')) {
                // Закрываем
                hintContent.classList.remove('active');
                this.textContent = '👀 Подсказка';
            } else {
                // Закрываем все остальные подсказки
                document.querySelectorAll('.hint-content').forEach(hint => {
                    hint.classList.remove('active');
                });
                document.querySelectorAll('.btn-hint').forEach(btn => {
                    btn.textContent = '👀 Подсказка';
                });
                
                // Открываем текущую
                hintContent.classList.add('active');
                this.textContent = 'Скрыть подсказку';
                
                // Сохраняем в прогресс
                saveProgress();
            }
        });
    });
}

// ================== ЧЕКЛИСТ ==================
function initChecklist() {
    document.querySelectorAll('.checklist-item input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const parent = this.parentElement;
            
            if (this.checked) {
                parent.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                parent.style.border = '1px solid #10b981';
            } else {
                parent.style.backgroundColor = '';
                parent.style.border = '';
            }
            
            // Сохраняем прогресс
            saveProgress();
        });
    });
}

// ================== АНИМАЦИЯ КАРТОЧЕК ==================
function initCards() {
    // Карточки с эффектом при наведении
    document.querySelectorAll('.card-glass, .cheatsheet-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Антипаттерны
    document.querySelectorAll('.anti-pattern, .symptom').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ================== МОДАЛЬНОЕ ОКНО ТЕСТА ==================
let testModal = null;

function initTestModal() {
    // Кнопка открытия теста
    const openTestBtn = document.getElementById('openTestBtn');
    if (openTestBtn) {
        openTestBtn.addEventListener('click', showTestModal);
    }
    
    // Кнопка проверки теста
    const checkTestBtn = document.getElementById('checkTestBtn');
    if (checkTestBtn) {
        checkTestBtn.addEventListener('click', checkTest);
    }
    
    // Инициализация модального окна Bootstrap
    const modalElement = document.getElementById('testModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
        testModal = new bootstrap.Modal(modalElement);
    }
}

function showTestModal() {
    // Сбрасываем предыдущие результаты
    const testResult = document.getElementById('testResult');
    if (testResult) {
        testResult.innerHTML = '';
        testResult.className = 'd-none';
    }
    
    // Сбрасываем выбор ответов
    document.querySelectorAll('#testModal input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Сбрасываем стили вариантов
    document.querySelectorAll('#testModal .option').forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    // Показываем модальное окно
    if (testModal) {
        testModal.show();
    }
}

function checkTest() {
    const correctAnswers = {
        q1: 'yagni',
        q2: 'dry', 
        q3: 'kiss'
    };
    
    let score = 0;
    let allAnswered = true;
    
    // Проверяем ответы
    Object.keys(correctAnswers).forEach(questionId => {
        const selected = document.querySelector(`#testModal input[name="${questionId}"]:checked`);
        const options = document.querySelectorAll(`#testModal input[name="${questionId}"]`);
        
        if (!selected) {
            allAnswered = false;
            return;
        }
        
        // Сбрасываем стили
        options.forEach(option => {
            const parentLabel = option.closest('.option');
            parentLabel.classList.remove('correct', 'incorrect');
        });
        
        if (selected.value === correctAnswers[questionId]) {
            score++;
            // Подсвечиваем правильный ответ
            selected.closest('.option').classList.add('correct');
        } else {
            // Подсвечиваем неправильный ответ
            selected.closest('.option').classList.add('incorrect');
            // И правильный тоже
            const correctOption = document.querySelector(
                `#testModal input[name="${questionId}"][value="${correctAnswers[questionId]}"]`
            );
            if (correctOption) {
                correctOption.closest('.option').classList.add('correct');
            }
        }
    });
    
    if (!allAnswered) {
        alert('Пожалуйста, ответьте на все вопросы!');
        return;
    }
    
    // Показываем результат
    const testResult = document.getElementById('testResult');
    if (!testResult) return;
    
    const totalQuestions = Object.keys(correctAnswers).length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    let message = '';
    let emoji = '';
    
    if (score === totalQuestions) {
        message = '🎉 Идеально! Ты настоящий мастер принципов разработки!';
        emoji = '🏆';
    } else if (score >= 2) {
        message = '👍 Отлично! Ты хорошо разбираешься в основах!';
        emoji = '⭐';
    } else {
        message = '📚 Есть куда расти! Попробуй пройти материалы еще раз.';
        emoji = '📖';
    }
    
    testResult.className = 'test-result';
    testResult.innerHTML = `
        <h5>Результат теста ${emoji}</h5>
        <div class="score-display">${score}/${totalQuestions}</div>
        <div class="result-message">${message}</div>
        <div class="progress mt-3">
            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" 
                 style="width: ${percentage}%"
                 aria-valuenow="${percentage}" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
                ${percentage}%
            </div>
        </div>
    `;
    
    // Прокручиваем к результату
    testResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ================== КНОПКА "НАВЕРХ" ==================
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.display = 'block';
            setTimeout(() => {
                scrollToTopBtn.style.opacity = '1';
            }, 10);
        } else {
            scrollToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 500) {
                    scrollToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
}

// ================== АНИМАЦИЯ ШПАРГАЛОК ==================
function initCheatsheetsObserver() {
    let cheatsheetsShown = false;
    
    const cheatsheetObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !cheatsheetsShown) {
                cheatsheetsShown = true;
                
                // Анимация появления шпаргалок
                document.querySelectorAll('.cheatsheet-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    const cheatsheetsSection = document.querySelector('.cheatsheets-section');
    if (cheatsheetsSection) {
        cheatsheetObserver.observe(cheatsheetsSection);
        
        // Инициализация начального состояния
        document.querySelectorAll('.cheatsheet-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
}

// ================== СОХРАНЕНИЕ ПРОГРЕССА ==================
function saveProgress() {
    const progress = {
        hintsOpened: Array.from(document.querySelectorAll('.hint-content.active')).length,
        checklistChecked: Array.from(document.querySelectorAll('.checklist-item input:checked')).length,
        lastSection: document.querySelector('.nav-link.active')?.getAttribute('href') || '#kiss',
        lastVisit: new Date().toISOString()
    };
    
    localStorage.setItem('codingPrinciplesProgress', JSON.stringify(progress));
}

function restoreProgress() {
    const savedProgress = localStorage.getItem('codingPrinciplesProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Восстанавливаем чеклист
        const checkboxes = document.querySelectorAll('.checklist-item input');
        checkboxes.forEach((checkbox, index) => {
            if (index < progress.checklistChecked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        // Показываем приветственное сообщение
        if (progress.lastVisit) {
            const lastVisit = new Date(progress.lastVisit);
            const now = new Date();
            const diffDays = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                showToast(`Рад снова тебя видеть! Прошло ${diffDays} ${getDayWord(diffDays)}.`);
            }
        }
    }
}

function getDayWord(days) {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return 'дня';
    return 'дней';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'progress-toast';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>👋</span>
            <span>${message}</span>
        </div>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid var(--primary);
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: fadeInUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Сохраняем прогресс при закрытии страницы
window.addEventListener('beforeunload', saveProgress);

// Анимации CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);