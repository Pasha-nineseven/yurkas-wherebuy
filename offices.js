document.addEventListener('DOMContentLoaded', function() {


    //select custom
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(function(customSelect) {
        initCustomSelect(customSelect);
    });
    
    function initCustomSelect(customSelect) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const options = customSelect.querySelector('.custom-select-options');
        const optionItems = options.querySelectorAll('.custom-select-option');
        const selectedValueSpan = trigger.querySelector('.selected-value');

        function setSelectedOption(option) {
            const optionCount = option.querySelector('.custom-select__count');
            
            const optionClone = option.cloneNode(true);
            const countInClone = optionClone.querySelector('.custom-select__count');
            if (countInClone) {
                countInClone.remove();
            }
            const text = optionClone.textContent.trim();
            
            if (optionCount) {
                selectedValueSpan.innerHTML = '<div class="selected-text">' + text + '</div>' + ' <div class="custom-select__count">' + optionCount.textContent + '</div>';
            } else {
                selectedValueSpan.textContent = text;
            }
        }
        
        const defaultSelected = options.querySelector('.custom-select-option.selected');
        if (defaultSelected) {
            setSelectedOption(defaultSelected);
        }
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = trigger.classList.contains('active');
            
            if (isOpen) {
                closeSelect();
            } else {
                openSelect();
            }
        });

        optionItems.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                optionItems.forEach(opt => opt.classList.remove('selected'));
                
                this.classList.add('selected');
                
                setSelectedOption(this);
                
                closeSelect();
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!customSelect.contains(e.target)) {
                closeSelect();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && trigger.classList.contains('active')) {
                closeSelect();
            }
        });
        
        function openSelect() {
            customSelects.forEach(function(select) {
                if (select !== customSelect) {
                    const otherTrigger = select.querySelector('.custom-select-trigger');
                    const otherOptions = select.querySelector('.custom-select-options');
                    if (otherTrigger && otherOptions) {
                        otherTrigger.classList.remove('active');
                        otherOptions.classList.remove('open');
                        otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            trigger.classList.add('active');
            options.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');

			document.querySelectorAll('.dropdown-container').forEach(container => {
				container.classList.remove('active');
			});
        }
        
        function closeSelect() {
            trigger.classList.remove('active');
            options.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    }



    //Проложить путь кнопка
    document.addEventListener('click', function(e) {
		const dropdownLink = e.target.closest('.dropdown-link');
		
		if (dropdownLink) {
			e.preventDefault();
			const container = dropdownLink.closest('.dropdown-container');
			
			if (container) {
				const wasActive = container.classList.contains('active');

				document.querySelectorAll('.dropdown-container').forEach(item => {
					item.classList.remove('active');
				});
				if (!wasActive) {
					container.classList.add('active');
				}
			}
		} else {
			document.querySelectorAll('.dropdown-container').forEach(container => {
				container.classList.remove('active');
			});
		}
	});
});





// card/list toggle
document.addEventListener('DOMContentLoaded', function() {
    const listButton = document.getElementById('offices-top__list');
    const mapButton = document.getElementById('offices-top__map');
    const officesList = document.querySelector('.p-offices-list');
    const officesMap = document.querySelector('.p-offices-map-view');
    
    if (listButton && mapButton && officesList && officesMap) {
        function showList() {
            officesList.classList.remove('minify');
            officesMap.style.display = 'none';
            listButton.classList.add('active');
            mapButton.classList.remove('active');
        }
        
        function showMap() {
            officesList.classList.add('minify');
            officesMap.style.display = 'block';
            listButton.classList.remove('active');
            mapButton.classList.add('active');
        }
        
        listButton.addEventListener('click', showList);
        mapButton.addEventListener('click', showMap);
    }
});


// card/list toggle
document.addEventListener('DOMContentLoaded', function() {
    const listButton = document.getElementById('offices-top__list');
    const mapButton = document.getElementById('offices-top__map');
    const officesList = document.querySelector('.p-offices-list');
    const officesMap = document.querySelector('.p-offices-map-view');
    
    if (listButton && mapButton && officesList && officesMap) {
        function showList() {
            officesList.classList.remove('minify');
            officesMap.style.display = 'none';
            listButton.classList.add('active');
            mapButton.classList.remove('active');
        }
        
        function showMap() {
            officesList.classList.add('minify');
            officesMap.style.display = 'block';
            listButton.classList.remove('active');
            mapButton.classList.add('active');
        }
        
        listButton.addEventListener('click', showList);
        mapButton.addEventListener('click', showMap);
    }
});

// Photo popup modal
document.addEventListener('DOMContentLoaded', function() {
    const photoPopups = document.querySelectorAll('.photo-popup');
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'photo-modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'photo-modal-container';
    
    const modalTitle = document.createElement('div');
    modalTitle.className = 'photo-modal-title';
    
    const modalImage = document.createElement('img');
    modalImage.className = 'photo-modal-image';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'photo-modal-close';
    closeButton.setAttribute('aria-label', 'Закрыть');
    
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(modalImage);
    modalContainer.appendChild(closeButton);
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);
    
    function openModal(imageSrc, title) {
        modalImage.src = imageSrc;
        if (title) {
            modalTitle.textContent = title;
            modalTitle.style.display = 'block';
        } else {
            modalTitle.style.display = 'none';
        }
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    photoPopups.forEach(function(photoPopup) {
        photoPopup.addEventListener('click', function(e) {
            e.preventDefault();
            const imageSrc = this.getAttribute('href');
            if (imageSrc && imageSrc !== '#') {
                let title = this.getAttribute('data-title');
                if (!title) {
                    const img = this.querySelector('img');
                    if (img) {
                        title = img.getAttribute('alt') || '';
                    }
                }
                openModal(imageSrc, title);
            }
        });
    });

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});

// Call modal (callback)
document.addEventListener('DOMContentLoaded', function() {
    const callLinks = document.querySelectorAll('.p-offices-list__call');
    const callModalOverlay = document.querySelector('.call-modal-overlay');
    const callCloseButton = document.querySelector('.call-modal-close');
    
    if (!callModalOverlay) return;
    
    function openCallModal() {
        callModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCallModal() {
        callModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    callLinks.forEach(function(callLink) {
        callLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCallModal();
        });
    });

    callModalOverlay.addEventListener('click', function(e) {
        if (e.target === callModalOverlay) {
            closeCallModal();
        }
    });
    
    if (callCloseButton) {
        callCloseButton.addEventListener('click', function(e) {
            e.stopPropagation();
            closeCallModal();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && callModalOverlay.classList.contains('active')) {
            closeCallModal();
        }
    });

    // Custom select in call modal
    const callModalSelects = document.querySelectorAll('.call-modal-select');
    
    callModalSelects.forEach(function(customSelect) {
        const trigger = customSelect.querySelector('.call-modal-select__trigger');
        const valueSpan = customSelect.querySelector('.call-modal-select__value');
        const options = customSelect.querySelectorAll('.call-modal-select__option');
        const nativeSelect = customSelect.parentElement.querySelector('.call-modal-select-native');
        
        if (!nativeSelect.value) {
            valueSpan.classList.add('placeholder');
        }
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            callModalSelects.forEach(function(otherSelect) {
                if (otherSelect !== customSelect) {
                    otherSelect.classList.remove('open');
                }
            });
            
            customSelect.classList.toggle('open');
        });
        
        options.forEach(function(option) {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                
                valueSpan.textContent = text;
                
                if (value === '') {
                    valueSpan.classList.add('placeholder');
                } else {
                    valueSpan.classList.remove('placeholder');
                }
                
                options.forEach(function(opt) {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                
                if (nativeSelect) {
                    nativeSelect.value = value;
                }
                
                customSelect.classList.remove('open');
            });
        });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.call-modal-select')) {
            callModalSelects.forEach(function(customSelect) {
                customSelect.classList.remove('open');
            });
        }
    });
});

// Scroll to top button
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const scrollBtn = document.querySelector('.p-offices-list__scroll');
        const listWrap = document.querySelector('.p-offices-list__wrap');
        
        if (!scrollBtn || !listWrap) return;
        
        scrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        function checkScroll() {
            const rect = listWrap.getBoundingClientRect();
            if (rect.top <= 70) {
                scrollBtn.classList.add('active');
            } else {
                scrollBtn.classList.remove('active');
            }
        }
        
        window.addEventListener('scroll', checkScroll);
        checkScroll();
    });
})();