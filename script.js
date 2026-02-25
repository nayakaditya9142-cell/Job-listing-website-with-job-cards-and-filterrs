const jobs = window.jobs;

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let filteredJobs = [...jobs];
    let savedJobIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    let showSavedOnly = false;
    let currentPage = 1;
    const itemsPerPage = 6;

    // DOM Elements
    const jobGrid = document.getElementById('job-grid');
    let jobCount = document.getElementById('job-count');
    const titleSearch = document.getElementById('job-title-search');
    const locationFilter = document.getElementById('location-filter');
    const categoryFilter = document.getElementById('category-filter');
    const experienceFilter = document.getElementById('experience-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const sortOrder = document.getElementById('sort-order');
    const modal = document.getElementById('job-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = modal ? modal.querySelector('.close-modal') : null;
    const pagination = document.getElementById('pagination');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navSearch = document.getElementById('nav-search');
    const navSearchInput = document.getElementById('nav-search-input');
    const savedJobsBtn = document.getElementById('saved-jobs-btn');
    const mobileSavedBtn = document.getElementById('mobile-saved-btn');
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.querySelector('.nav-actions .btn-primary');
    const mobileLoginBtn = document.querySelector('.nav-links .btn-primary');
    const closeLogin = document.querySelector('.close-login');
    const loginForm = document.getElementById('login-form');
    const infoModal = document.getElementById('info-modal');
    const infoBody = document.getElementById('info-modal-body');
    const closeInfo = document.querySelector('.close-info');
    const footerLinks = document.querySelectorAll('.footer-links a');
    const companiesLink = document.getElementById('companies-link');
    const salariesLink = document.getElementById('salaries-link');
    const alertModal = document.getElementById('alert-modal');
    const closeAlert = document.querySelector('.close-alert');
    const alertForm = document.getElementById('alert-form');
    const setAlertBtn = document.querySelector('.promo-card .btn');
    const showFiltersBtn = document.getElementById('show-filters');
    const closeFiltersBtn = document.getElementById('close-filters');
    const filtersSidebar = document.getElementById('filters-sidebar');

    // Initialize
    renderJobs();
    lucide.createIcons();

    // Scroll Observer for Navbar and Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        if (window.scrollY > heroHeight - 80) {
            navSearch.classList.add('visible');
        } else {
            navSearch.classList.remove('visible');
        }
    });

    // Sync Search Inputs
    navSearchInput.addEventListener('input', (e) => {
        titleSearch.value = e.target.value;
        applyFilters();
    });

    titleSearch.addEventListener('input', (e) => {
        navSearchInput.value = e.target.value;
        applyFilters();
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    if (mobileSavedBtn) {
        mobileSavedBtn.addEventListener('click', toggleSavedView);
    }

    if (savedJobsBtn) {
        savedJobsBtn.addEventListener('click', toggleSavedView);
    }

    function toggleSavedView() {
        showSavedOnly = !showSavedOnly;

        // Update UI state for both buttons
        [savedJobsBtn, mobileSavedBtn].forEach(btn => {
            if (!btn) return;
            if (showSavedOnly) {
                btn.classList.add('active');
                btn.querySelector('span').textContent = 'Showing Saved';
            } else {
                btn.classList.remove('active');
                btn.querySelector('span').textContent = 'Saved';
            }
        });

        applyFilters();

        // Scroll to results section to show changes
        if (showSavedOnly) {
            const listingsHeader = document.querySelector('.listings-header');
            if (listingsHeader) {
                window.scrollTo({
                    top: listingsHeader.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Event Listeners
    titleSearch.addEventListener('input', applyFilters);

    locationFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    experienceFilter.addEventListener('change', applyFilters);
    sortOrder.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', () => {
        titleSearch.value = '';
        locationFilter.value = '';
        categoryFilter.value = '';
        experienceFilter.value = '';
        applyFilters();
        if (window.innerWidth <= 1024) {
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    if (showFiltersBtn) {
        showFiltersBtn.onclick = () => {
            filtersSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }

    if (closeFiltersBtn) {
        closeFiltersBtn.onclick = () => {
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    }

    // Login Modal Handlers
    const openLogin = () => {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    if (loginBtn) loginBtn.onclick = openLogin;
    if (mobileLoginBtn) mobileLoginBtn.onclick = openLogin;

    if (closeLogin) {
        closeLogin.onclick = () => {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            alert('Login successful! Welcome back.');
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    // Info Modal Handlers
    const infoContent = {
        'About Us': {
            title: 'About EmployHub',
            content: `
                <p>Welcome to <b>EmployHub</b>, the ultimate destination for career growth and talent acquisition. Founded in 2026, our platform started with a simple vision: to bridge the gap between dream jobs and dream candidates through a transparent, efficient, and user-friendly experience.</p>
                <h3>Our Vision</h3>
                <p>To empower every professional with the tools they need to find work that is not just a job, but a calling. We believe that when people find the right fit, they don't just work—they thrive.</p>
                <h3>What Makes Us Different?</h3>
                <div class="about-features">
                    <div class="about-feature">
                        <b>Verified Listings</b>
                        <p>Our dedicated team manually verifies every company profile and job posting to ensure zero spam and 100% authenticity.</p>
                    </div>
                    <div class="about-feature">
                        <b>Smart Technology</b>
                        <p>Our advanced filtering and matching algorithms help you cut through the noise and find relevant opportunities in seconds.</p>
                    </div>
                    <div class="about-feature">
                        <b>Growth Focused</b>
                        <p>Beyond job listings, we provide a ecosystem for growth, including saved jobs tracking and detailed company insights.</p>
                    </div>
                </div>
                <h3>Our Community</h3>
                <p>Today, EmployHub serves over 1 million users across India and has partnered with 5,000+ top-tier companies, from rising startups to Fortune 500 giants.</p>
            `
        },
        'Contact': {
            title: 'Contact Us',
            content: `
                <p>Have questions, feedback, or need technical support? We're here to help you navigate your journey with EmployHub.</p>
                <div class="contact-grid">
                    <a href="mailto:adityabikram27@gmail.com?subject=EmployHub%20Inquiry&body=Hi%20Aditya,%20I'm%20interested%20in..." class="contact-item link-item">
                        <i data-lucide="mail"></i>
                        <b>Email Support</b>
                        <span>adityabikram27@gmail.com</span>
                    </a>
                    <a href="tel:8637224695" class="contact-item link-item">
                        <i data-lucide="phone"></i>
                        <b>Call Us</b>
                        <span>8637224695</span>
                    </a>
                    <div class="contact-item">
                        <i data-lucide="map-pin"></i>
                        <b>Our Hub</b>
                        <span>Cuttack, Odisha</span>
                    </div>
                </div>
                <div class="info-footer">
                    <p>Standard response time is within 24 business hours.</p>
                </div>
            `
        },
        'Privacy Policy': {
            title: 'Privacy & Security',
            content: `
                <p>Last updated: February 2026</p>
                <p>Your trust is our most valuable asset. This policy outlines how we protect and handle your personal information.</p>
                <h3>1. Data Collection</h3>
                <p>We only collect data that improves your job search, such as your professional profile, saved preferences, and application history.</p>
                <h3>2. Zero Data Selling</h3>
                <p>EmployHub <b>never</b> sells your personal data to third-party advertisers. Your information is used strictly for connecting you with potential employers.</p>
                <h3>3. Secure Encryption</h3>
                <p>We use enterprise-grade AES-256 encryption to protect your data at rest and TLS 1.3 for data in transit.</p>
                <h3>4. Your Control</h3>
                <p>You have full control over your data, including the ability to export or delete your account information at any time.</p>
            `
        }
    };

    if (footerLinks) {
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const type = e.target.textContent;
                if (infoContent[type]) {
                    e.preventDefault();
                    showInfoModal(type);
                }
            });
        });
    }

    function showInfoModal(type) {
        const data = infoContent[type];
        infoBody.innerHTML = `
            <div class="info-header">
                <h2>${data.title}</h2>
            </div>
            <div class="info-body-text">
                ${data.content}
            </div>
            <div class="info-modal-footer">
                <button class="btn btn-primary close-info-btn">Understood</button>
            </div>
        `;
        infoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        lucide.createIcons();

        const closeBtn = infoBody.querySelector('.close-info-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                infoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }
    }

    if (closeInfo) {
        closeInfo.onclick = () => {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    // Companies Directory Handlers
    function showCompanies() {
        // Extract unique companies
        const uniqueCompanies = [...new Set(jobs.map(job => job.company))].sort();

        infoBody.innerHTML = `
            <div class="info-header">
                <h2>Top Companies on EmployHub</h2>
                <p>Discover leading employers hiring now</p>
            </div>
            <div class="company-directory">
                ${uniqueCompanies.map(company => {
            const jobCount = jobs.filter(j => j.company === company).length;
            return `
                        <div class="company-item" onclick="filterByCompany('${company}')">
                            <div class="company-logo-avatar">
                                ${company.charAt(0)}
                            </div>
                            <div class="company-info">
                                <b>${company}</b>
                                <span>${jobCount} Open Position${jobCount > 1 ? 's' : ''}</span>
                            </div>
                            <i data-lucide="chevron-right"></i>
                        </div>
                    `;
        }).join('')}
            </div>
            <div class="info-modal-footer">
                <button class="btn btn-outline close-info-btn">Close Directory</button>
            </div>
        `;

        infoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        lucide.createIcons();

        const closeBtn = infoBody.querySelector('.close-info-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                infoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }
    }

    if (companiesLink) {
        companiesLink.addEventListener('click', (e) => {
            e.preventDefault();
            showCompanies();
        });
    }

    window.filterByCompany = (companyName) => {
        titleSearch.value = companyName;
        infoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        applyFilters();

        // Scroll to results
        const listingsHeader = document.querySelector('.listings-header');
        if (listingsHeader) {
            window.scrollTo({
                top: listingsHeader.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    // Salaries Directory Handlers
    function showSalaries() {
        const categories = [...new Set(jobs.map(job => job.category))];
        const salaryData = categories.map(cat => {
            const catJobs = jobs.filter(j => j.category === cat);
            const salaries = catJobs.map(j => {
                const matches = j.salary.replace(/,/g, '').match(/\d+/g);
                if (matches) {
                    const nums = matches.map(Number);
                    return nums.reduce((a, b) => a + b) / nums.length;
                }
                return 0;
            }).filter(s => s > 0);

            const avg = salaries.length ? Math.round(salaries.reduce((a, b) => a + b) / salaries.length) : 0;
            const min = salaries.length ? Math.min(...salaries) : 0;
            const max = salaries.length ? Math.max(...salaries) : 0;

            return { category: cat, avg, min, max, count: catJobs.length };
        }).sort((a, b) => b.avg - a.avg);

        const formatCurrency = (num) => {
            if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
            if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
            return `₹${num.toLocaleString('en-IN')}`;
        };

        infoBody.innerHTML = `
            <div class="info-header">
                <h2>Salary Guide 2026</h2>
                <p>Based on current market data and projected 2026 benchmarks</p>
            </div>
            <div class="salary-grid">
                ${salaryData.map(data => `
                    <div class="salary-card" onclick="filterByCategory('${data.category}')">
                        <div class="salary-card-header">
                            <b>${data.category}</b>
                            <span>${data.count} Jobs</span>
                        </div>
                        <div class="salary-amount">${formatCurrency(data.avg)} <span>avg / year</span></div>
                        <div class="salary-range">
                            <div class="range-bar">
                                <div class="range-fill" style="width: 60%; margin-left: 20%;"></div>
                            </div>
                            <div class="range-labels">
                                <span>Min: ${formatCurrency(data.min)}</span>
                                <span>Max: ${formatCurrency(data.max)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="info-modal-footer">
                <button class="btn btn-outline close-info-btn">Close Salary Guide</button>
            </div>
        `;

        infoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        const closeBtn = infoBody.querySelector('.close-info-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                infoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }
    }

    if (salariesLink) {
        salariesLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSalaries();
        });
    }

    window.filterByCategory = (category) => {
        categoryFilter.value = category;
        infoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        applyFilters();

        // Scroll to results
        const listingsHeader = document.querySelector('.listings-header');
        if (listingsHeader) {
            window.scrollTo({
                top: listingsHeader.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    // Job Alert Handlers
    if (setAlertBtn) {
        setAlertBtn.onclick = () => {
            alertModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };
    }

    if (closeAlert) {
        closeAlert.onclick = () => {
            alertModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    if (alertForm) {
        alertForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('alert-email').value;
            const category = document.getElementById('alert-category').value;
            alert(`Great! Job alerts for ${category || 'all categories'} will be sent to ${email}.`);
            alertModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    // Modal Global Closer
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target == infoModal) {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target == alertModal) {
            alertModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Core Functions
    function applyFilters() {
        const titleQuery = titleSearch.value.toLowerCase();
        const locationQuery = locationFilter.value;
        const categoryQuery = categoryFilter.value;
        const experienceQuery = experienceFilter.value;

        filteredJobs = jobs.filter(job => {
            const matchesTitle = job.title.toLowerCase().includes(titleQuery) ||
                job.company.toLowerCase().includes(titleQuery);
            const matchesLocation = !locationQuery || job.location.trim() === locationQuery.trim();
            const matchesCategory = !categoryQuery || job.category.trim() === categoryQuery.trim();
            const matchesExperience = !experienceQuery || job.experience === experienceQuery;
            const matchesSaved = !showSavedOnly || savedJobIds.includes(job.id);

            return matchesTitle && matchesLocation && matchesCategory && matchesExperience && matchesSaved;
        });

        // Sorting
        if (sortOrder.value === 'salary-high') {
            filteredJobs.sort((a, b) => {
                const getSalary = (str) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
                return getSalary(b.salary) - getSalary(a.salary);
            });
        } else {
            // Default to id (simulate newest)
            filteredJobs.sort((a, b) => b.id - a.id);
        }

        currentPage = 1;
        renderJobs();
    }

    function renderJobs() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filteredJobs.slice(start, end);

        jobGrid.innerHTML = '';

        if (pageItems.length === 0) {
            jobGrid.innerHTML = `
                <div class="no-results">
                    <i data-lucide="search-x"></i>
                    <h3>${showSavedOnly ? 'No saved jobs' : 'No jobs found'}</h3>
                    <p>${showSavedOnly ? 'Browse jobs and click the bookmark icon to save them for later.' : 'Try adjusting your search or filters to find what you\'re looking for.'}</p>
                </div>
            `;
            updateJobCount(0);
            pagination.innerHTML = '';
            lucide.createIcons();
            return;
        }

        pageItems.forEach(job => {
            const isSaved = savedJobIds.includes(job.id);
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-card-header">
                    <div class="job-info">
                        <span class="company-name">${job.company}</span>
                        <h3>${job.title}</h3>
                    </div>
                    <button class="save-btn ${isSaved ? 'active' : ''}" data-id="${job.id}">
                        <i data-lucide="bookmark" fill="${isSaved ? 'currentColor' : 'none'}"></i>
                    </button>
                </div>
                <div class="job-tags">
                    <span class="tag"><i data-lucide="map-pin"></i> ${job.location}</span>
                    <span class="tag"><i data-lucide="clock"></i> ${job.type}</span>
                    <span class="tag"><i data-lucide="briefcase"></i> ${job.experience}</span>
                </div>
                <p class="job-desc">${job.description}</p>
                <div class="job-card-footer">
                    <span class="salary">${job.salary}</span>
                    <button class="btn btn-outline btn-sm view-more" data-id="${job.id}">View Details</button>
                </div>
            `;
            jobGrid.appendChild(card);
        });

        updateJobCount(filteredJobs.length);
        renderPagination();
        lucide.createIcons();
        attachCardListeners();
    }

    function updateJobCount(count) {
        const resultsHeader = document.querySelector('.results-count');
        if (showSavedOnly) {
            resultsHeader.innerHTML = `<i data-lucide="bookmark" style="vertical-align: middle; color: var(--primary); fill: var(--primary); margin-right: 8px;"></i> Your Saved Jobs (<span id="job-count">${count}</span>)`;
        } else {
            resultsHeader.innerHTML = `Showing <span id="job-count">${count}</span> jobs`;
        }
        jobCount = document.getElementById('job-count');
        lucide.createIcons();
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `paginate-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderJobs();
                window.scrollTo({ top: 500, behavior: 'smooth' });
            };
            pagination.appendChild(btn);
        }
    }

    function attachCardListeners() {
        document.querySelectorAll('.view-more').forEach(btn => {
            btn.onclick = () => showJobDetails(btn.dataset.id);
        });

        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.onclick = () => toggleSaveJob(btn);
        });
    }

    function showJobDetails(id) {
        const job = jobs.find(j => j.id == id);
        if (!job) return;

        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="company-name">${job.company}</span>
                <h2>${job.title}</h2>
                <div class="job-tags">
                    <span class="tag"><i data-lucide="map-pin"></i> ${job.location}</span>
                    <span class="tag"><i data-lucide="layers"></i> ${job.category}</span>
                    <span class="tag"><i data-lucide="clock"></i> ${job.type}</span>
                    <span class="tag"><i data-lucide="indian-rupee"></i> ${job.salary}</span>
                </div>
            </div>
            <div class="modal-main">
                <div class="modal-section">
                    <h3>About the role</h3>
                    <p>${job.description}</p>
                </div>
                <div class="modal-section">
                    <h3>Requirements</h3>
                    <ul>
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-section">
                    <h3>Benefits</h3>
                    <p>Competitive salary, flexible hours, health insurance, and more.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary btn-apply">Apply Now</button>
                <span class="posted-date">Posted ${job.posted}</span>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        lucide.createIcons();

        const applyBtn = modalBody.querySelector('.btn-apply');
        if (applyBtn) {
            applyBtn.onclick = () => {
                modalBody.innerHTML = `
                    <div class="modal-header">
                        <h2>Apply for ${job.title}</h2>
                        <span class="company-name">at ${job.company}</span>
                    </div>
                    <form id="apply-form" class="apply-form" style="padding-top: 15px;">
                        <div class="form-group">
                            <label for="applicant-name" style="display:block; margin-bottom:5px; font-weight:500;">Full Name</label>
                            <input type="text" id="applicant-name" required placeholder="John Doe" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px;">
                        </div>
                        <div class="form-group">
                            <label for="applicant-email" style="display:block; margin-bottom:5px; font-weight:500;">Email Address</label>
                            <input type="email" id="applicant-email" required placeholder="john@example.com" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px;">
                        </div>
                        <div class="form-group">
                            <label for="applicant-phone" style="display:block; margin-bottom:5px; font-weight:500;">Phone Number</label>
                            <input type="tel" id="applicant-phone" required placeholder="+91 9876543210" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px;">
                        </div>
                        <div class="form-group">
                            <label for="applicant-resume" style="display:block; margin-bottom:5px; font-weight:500;">Resume/CV Link</label>
                            <input type="url" id="applicant-resume" required placeholder="Google Drive or Portfolio link" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px;">
                        </div>
                        <div class="modal-footer" style="margin-top: 20px; display: flex; gap: 10px;">
                            <button type="button" class="btn btn-outline" id="cancel-apply">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Application</button>
                        </div>
                    </form>
                `;

                const cancelBtn = modalBody.querySelector('#cancel-apply');
                if (cancelBtn) {
                    cancelBtn.onclick = () => showJobDetails(id);
                }

                const applyForm = modalBody.querySelector('#apply-form');
                if (applyForm) {
                    applyForm.onsubmit = (e) => {
                        e.preventDefault();
                        alert('Application successfully submitted for ' + job.title + ' at ' + job.company + '!');
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    };
                }
            };
        }
    }

    function toggleSaveJob(btn) {
        const id = parseInt(btn.dataset.id);
        const index = savedJobIds.indexOf(id);

        if (index > -1) {
            savedJobIds.splice(index, 1);
            btn.classList.remove('active');
            btn.querySelector('svg').setAttribute('fill', 'none');
        } else {
            savedJobIds.push(id);
            btn.classList.add('active');
            btn.querySelector('svg').setAttribute('fill', 'currentColor');
        }

        localStorage.setItem('savedJobs', JSON.stringify(savedJobIds));

        // If we are currently in "Saved Only" view and we just un-saved a job, 
        // we should re-apply filters to remove the card immediately
        if (showSavedOnly) {
            applyFilters();
        }
    }
});

