document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');
    const body = document.body;
    const successPopup = document.getElementById('success-popup');
    const closePopup = document.getElementById('close-popup');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorPopup = document.getElementById('close-error-popup');
    const loadingPopup = document.getElementById('loading-popup');
    const submitBtn = document.getElementById('submit-btn');
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const productInput = document.getElementById('product');
    const messageInput = document.getElementById('message');
    const productButtons = document.querySelector('.product-buttons');
    const nameLabel = document.getElementById('name-label');
    const surnameLabel = document.getElementById('surname-label');
    const emailLabel = document.getElementById('email-label');
    const productLabel = document.getElementById('product-label');
    const messageLabel = document.getElementById('message-label');
    const referralInput = document.getElementById('referral');
    const referralLabel = document.getElementById('referral-label');

    // Ensure popups are hidden on page load
    if (successPopup) successPopup.style.display = 'none';
    if (errorPopup) errorPopup.style.display = 'none';
    if (loadingPopup) loadingPopup.style.display = 'none';

    // Email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Original label texts
    const originalLabels = {
        name: 'First Name',
        surname: 'Surname',
        email: 'Email',
        product: 'Select Product',
        message: 'More Info you think might help',
        referral: 'Referral Code'
    };

    // Clear error messages and invalid classes
    function clearErrors() {
        nameLabel.textContent = originalLabels.name;
        surnameLabel.textContent = originalLabels.surname;
        emailLabel.textContent = originalLabels.email;
        productLabel.textContent = originalLabels.product;
        messageLabel.textContent = originalLabels.message;
        referralLabel.textContent = originalLabels.referral;
        nameLabel.classList.remove('error');
        surnameLabel.classList.remove('error');
        emailLabel.classList.remove('error');
        productLabel.classList.remove('error');
        messageLabel.classList.remove('error');
        referralLabel.classList.remove('error');
        nameInput.classList.remove('invalid');
        surnameInput.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        messageInput.classList.remove('invalid');
        productButtons.classList.remove('invalid');
        referralInput.classList.remove('invalid');
    }

    // Validate form fields
    function validateForm() {
        let isValid = true;
        clearErrors();

        // First Name
        if (!nameInput.value.trim()) {
            nameLabel.textContent = 'First Name is required';
            nameLabel.classList.add('error');
            nameInput.classList.add('invalid');
            isValid = false;
        }

        // Surname
        if (!surnameInput.value.trim()) {
            surnameLabel.textContent = 'Surname is required';
            surnameLabel.classList.add('error');
            surnameInput.classList.add('invalid');
            isValid = false;
        }

        // Email
        if (!emailInput.value.trim()) {
            emailLabel.textContent = 'Email is required';
            emailLabel.classList.add('error');
            emailInput.classList.add('invalid');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailLabel.textContent = 'Invalid email format';
            emailLabel.classList.add('error');
            emailInput.classList.add('invalid');
            isValid = false;
        }

        // Product
        if (!productInput.value) {
            productLabel.textContent = 'Please select a product';
            productLabel.classList.add('error');
            productButtons.classList.add('invalid');
            isValid = false;
        }

        return isValid;
    }

    // Toggle navbar (removed custom logic, rely on Bootstrap)
    // Add navbar-open class to body for styling
    navbarToggler.addEventListener('click', () => {
        const isExpanded = navbarCollapse.classList.contains('show');
        if (isExpanded) {
            body.classList.remove('navbar-open');
        } else {
            body.classList.add('navbar-open');
        }
    });

    // Scroll with offset function
    function scrollWithOffset(target, offset) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    // Smooth scrolling for navbar links and Get Started button
    document.querySelectorAll('.nav-link, .smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 80 : 70;

            scrollWithOffset(targetElement, offset);

            if (this.classList.contains('nav-link')) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
                body.classList.remove('navbar-open');
            }
        });
    });

    // Smooth scrolling for product buttons in Products section
    document.querySelectorAll('.btn[data-product][href]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 80 : 70;

            scrollWithOffset(targetElement, offset);

            const product = this.getAttribute('data-product');
            if (product) {
                selectProduct(product);
            }
        });
    });

    // Product selection buttons in the contact form
    const productBtnList = document.querySelectorAll('.product-btn');
    productBtnList.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            selectProduct(product);
        });
    });

    function selectProduct(product) {
        productBtnList.forEach(btn => btn.classList.remove('active'));
        const selectedButton = document.querySelector(`.product-btn[data-product="${product}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
        productInput.value = product;
    }

    // Clear errors on input
    [nameInput, surnameInput, emailInput, messageInput, referralInput].forEach(input => {
        input.addEventListener('input', clearErrors);
    });
    productBtnList.forEach(button => {
        button.addEventListener('click', clearErrors);
    });

    // Contact form submission with fetch
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading popup and disable button
        loadingPopup.style.display = 'flex';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            product: formData.get('product'),
            message: formData.get('message'),
            referral: formData.get('referral')
        };

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                successPopup.style.display = 'flex';
                contactForm.reset();
                productBtnList.forEach(btn => btn.classList.remove('active'));
                productInput.value = '';
                clearErrors();
            } else {
                let errorTextField = document.getElementById('errorTextField');
                errorTextField.textContent = result.error;
                errorPopup.style.display = 'flex';
            }
        } catch (error) {
            console.error('Form submission error:', error);
            errorPopup.style.display = 'flex';
        } finally {
            loadingPopup.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // Close success popup
    closePopup.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });

    // Close error popup
    closeErrorPopup.addEventListener('click', () => {
        errorPopup.style.display = 'none';
    });

    // Close popups when clicking outside
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            successPopup.style.display = 'none';
        }
    });

    errorPopup.addEventListener('click', (e) => {
        if (e.target === errorPopup) {
            errorPopup.style.display = 'none';
        }
    });
});