document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Active Navigation Link
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a:not(.btn)');
    
    navItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 3. Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-card, .testimonial-card, .step-card, .section-header').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // 4. Registration Button Alert
    const registerBtns = document.querySelectorAll('.btn-primary');
    registerBtns.forEach(btn => {
        if(btn.textContent.trim().toLowerCase() === 'register now' || btn.textContent.trim().toLowerCase() === 'view details' || btn.textContent.trim().toLowerCase() === 'view opportunity') {
            btn.addEventListener('click', (e) => {
                if(btn.tagName === 'A' && btn.getAttribute('href') === '#') {
                    e.preventDefault();
                    showModal('Event Registration', '<p>Registration will open soon. Please check back later.</p><button class="btn btn-primary close-modal-btn mt-3">Got it</button>');
                }
            });
        }
    });

    // 5. Search and Filtering (for Events and Opportunities pages)
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.filterable-item');

    if (searchInput || filterBtns.length > 0) {
        
        const filterItems = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

            items.forEach(item => {
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const category = item.dataset.category;
                const matchesSearch = title.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || category === activeFilter;

                if (matchesSearch && matchesFilter) {
                    item.style.display = 'flex'; // maintain flex layout for cards
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        };

        if (searchInput) {
            searchInput.addEventListener('input', filterItems);
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterItems();
            });
        });
    }

    // 6. Modal Logic
    const modal = document.getElementById('customModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalElements = document.querySelectorAll('.close-modal');

    function showModal(title, content) {
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            modal.classList.add('active');
            
            // Re-attach listener for dynamic close buttons inside modal
            const dynamicCloseBtn = modalBody.querySelector('.close-modal-btn');
            if (dynamicCloseBtn) {
                dynamicCloseBtn.addEventListener('click', hideModal);
            }
        } else {
            // Fallback if modal HTML isn't on page
            alert(title + "\n\n" + content.replace(/<[^>]*>?/gm, ''));
        }
    }

    function hideModal() {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    if (closeModalElements) {
        closeModalElements.forEach(el => {
            el.addEventListener('click', hideModal);
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    // 7. Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Show success message
                showModal('Success!', '<div style="text-align:center; color:var(--success);"><i class="fas fa-check-circle fa-4x mb-3"></i><p>Thanks! Your message has been received.</p></div>');
                contactForm.reset();
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }

    // 8. Back to Top Button
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
