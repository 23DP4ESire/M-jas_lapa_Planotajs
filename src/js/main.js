document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const showError = (input, message) => {
        const errorElement = document.getElementById(`${input.id}Error`);
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    };

    const clearError = (input) => {
        const errorElement = document.getElementById(`${input.id}Error`);
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    };

    const validateInput = (input) => {
        if (!input.value.trim()) {
            showError(input, 'Šis lauks ir obligāts');
            return false;
        }
        
        if (input.type === 'email' && !validateEmail(input.value)) {
            showError(input, 'Lūdzu, ievadiet derīgu e-pasta adresi');
            return false;
        }

        clearError(input);
        return true;
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;

        if (!validateInput(name)) isValid = false;
        if (!validateInput(email)) isValid = false;
        if (!validateInput(message)) isValid = false;

        if (isValid) {
            contactForm.reset();
            formSuccess.style.display = 'block';
            
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });

    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    const searchInput = document.getElementById('searchInput');
    const searchToggle = document.getElementById('searchToggle');
    const cards = document.querySelectorAll('.card');
    let isSearchVisible = false;

    searchToggle.addEventListener('click', () => {
        isSearchVisible = !isSearchVisible;
        if (isSearchVisible) {
            searchInput.style.display = 'block';
            searchInput.style.animation = 'fadeInRight 0.3s ease-out forwards';
            searchInput.focus();
        } else {
            searchInput.style.animation = 'fadeOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                searchInput.style.display = 'none';
                searchInput.value = '';
                cards.forEach(card => {
                    card.style.display = 'block';
                    card.style.animation = 'cardAppear 0.5s ease-out forwards';
                });
            }, 300);
        }
    });

    document.addEventListener('click', (e) => {
        if (isSearchVisible && !e.target.closest('.search-container')) {
            isSearchVisible = false;
            searchInput.style.animation = 'fadeOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                searchInput.style.display = 'none';
                searchInput.value = '';
                cards.forEach(card => {
                    card.style.display = 'block';
                    card.style.animation = 'cardAppear 0.5s ease-out forwards';
                });
            }, 300);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'cardAppear 0.5s ease-out forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.querySelector('.toggle-text').textContent = 'Dienas režīms';
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        const toggleText = darkModeToggle.querySelector('.toggle-text');
        if (body.classList.contains('dark-mode')) {
            toggleText.textContent = 'Dienas režīms';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggleText.textContent = 'Nakts režīms';
            localStorage.setItem('darkMode', null);
        }
    });

    const hamburger = document.getElementById('hamburgerMenu');
    const navList = document.querySelector('.nav-list');

    hamburger.addEventListener('click', () => {
        navList.classList.toggle('show');
        hamburger.classList.toggle('active');
    });

    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });






    const modal = document.getElementById('cardModal');
    const cardButtons = document.querySelectorAll('.card-button');
    const closeModal = document.querySelector('.close-modal');

    cardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const description = card.querySelector('.card-description').textContent;
            const image = card.querySelector('.card-image').src;

            modal.querySelector('.modal-title').textContent = title;
            modal.querySelector('.modal-description').textContent = description;
            modal.querySelector('.modal-image').src = image;
            modal.querySelector('.modal-image').alt = title;

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && window.innerWidth <= 768) {
            navList.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });

    const titleEl = document.getElementById('title');
    const descEl = document.getElementById('desc');
    const imgEl = document.getElementById('img');
    const linkEl = document.getElementById('link');
    const createBtn = document.querySelector('.button');
    const createCardBtn = document.getElementById('createCardBtn');
    const createForm = document.getElementById('createCardForm');
    const cardsEl = document.getElementById('cards');

    const STORAGE_KEY = 'planotajs_cards_v1';

    const loadSavedCards = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed;
        } catch (e) {
            console.error('Failed to load saved cards', e);
            return [];
        }
    };

    const saveAllCards = (cards) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        } catch (e) {
            console.error('Failed to save cards', e);
        }
    };

    const addCardToStorage = (card) => {
        const all = loadSavedCards();
        all.unshift(card);
        saveAllCards(all);
    };

    const removeCardFromStorage = (id) => {
        const all = loadSavedCards();
        const filtered = all.filter(c => c.id !== id);
        saveAllCards(filtered);
    };

    function isValidUrl(s){ try{ new URL(s); return true }catch(e){ return false }}

    function createCardObject(){
        return {
            id: Date.now().toString() + '-' + Math.floor(Math.random()*100000),
            title: titleEl ? titleEl.value.trim() : '',
            desc: descEl ? descEl.value.trim() : '',
            img: imgEl ? imgEl.value.trim() : '',
            link: linkEl ? linkEl.value.trim() : ''
        };
    }

    function wireCardInteractions(el){
        const moreBtn = el.querySelector('.card-button');
        if(moreBtn){
            moreBtn.addEventListener('click', () => {
                const title = el.querySelector('.card-title')?.textContent || '';
                const description = el.querySelector('.card-description')?.textContent || '';
                const image = el.querySelector('img')?.src || '';

                modal.querySelector('.modal-title').textContent = title;
                modal.querySelector('.modal-description').textContent = description;
                modal.querySelector('.modal-image').src = image;
                modal.querySelector('.modal-image').alt = title;

                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }

        const del = el.querySelector('.delete-card');
        if(del){
            del.addEventListener('click', () => {
                const id = el.dataset.id;
                if (id) removeCardFromStorage(id);
                el.remove();
            });
        }
    }

    function renderCard(card){
        const el = document.createElement('div'); el.className = 'card';
        if (card.id) el.dataset.id = card.id;
        if(card.img && isValidUrl(card.img)){
            const im = document.createElement('img'); im.src = card.img; im.alt = card.title || 'attels'; im.className = 'card-image'; el.appendChild(im);
        }
        const h = document.createElement('h3'); h.textContent = card.title || 'Bez virsraksta'; h.className='card-title'; el.appendChild(h);
        const p = document.createElement('p'); p.textContent = card.desc || ''; p.className='card-description'; el.appendChild(p);

    const actions = document.createElement('div'); actions.className = 'actions';
        if(card.link && isValidUrl(card.link)){
            const a = document.createElement('a'); a.href = card.link; a.target = '_blank'; a.rel='noopener noreferrer'; a.textContent = 'Apmeklēt'; a.className='card-link'; actions.appendChild(a);
        }
        const more = document.createElement('button'); more.textContent = 'Apskatīt vairāk'; more.className='card-button'; actions.appendChild(more);
        const del = document.createElement('button'); del.textContent = 'Dzēst'; del.className='delete-card'; actions.appendChild(del);
        el.appendChild(actions);

        if(cardsEl) cardsEl.prepend(el);

        wireCardInteractions(el);
    }

    if(createBtn && createForm){
        createBtn.addEventListener('click', () => {
            createForm.style.display = createForm.style.display === 'none' ? 'block' : 'none';
        });
    }

    if(createCardBtn){
        createCardBtn.addEventListener('click', ()=>{
            const card = createCardObject();
            if(!card.title && !card.desc && !card.img) {
                alert('Ievadi vismaz virsrakstu, aprakstu vai bildes URL.');
                return;
            }
            renderCard(card);
            addCardToStorage(card);
            if(titleEl) titleEl.value = '';
            if(descEl) descEl.value = '';
            if(imgEl) imgEl.value = '';
            if(linkEl) linkEl.value = '';
            createForm.style.display = 'none';
        });
    }

    const saved = loadSavedCards();
    if (Array.isArray(saved) && saved.length) {
        saved.slice().reverse().forEach(card => renderCard(card));
    }

    const existingCards = document.querySelectorAll('.cards-container .card');
    existingCards.forEach(card => wireCardInteractions(card));
});
