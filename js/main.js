let lazyLoadInstance;
function lazyLoadImages(selector, options = { threshold: 0.5 }) {
  const images = document.querySelectorAll(`${selector}[data-src]:not(.inited)`);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.onerror = function() {
          const parentElem = img.parentElement;
          const newImg = document.createElement("img");
          const stubPath = img.getAttribute("data-stub") || "images/stub.svg";
          const stubAlt = img.getAttribute("data-stub-alt") || "Не удалось загрузить изображение";
          newImg.setAttribute("src", stubPath);
          newImg.setAttribute("alt", stubAlt);
          if (parentElem.tagName === "PICTURE") {
            parentElem.after(newImg);
            parentElem.remove();
          } else {
            img.after(newImg);
            img.remove();
          }
        }; 
        img.src = img.dataset.src;
        img.classList.add("loaded");
        if (img.parentElement.tagName === "PICTURE") {
          const pictureSource = img.parentElement.querySelector("source");
          if (pictureSource) {
            pictureSource.setAttribute("srcset", pictureSource.dataset.srcset)
          }
        }
        observer.unobserve(img);
      }
    });
  }, options);

  images.forEach(image => {
    observer.observe(image);
    image.classList.add("inited");
  });
}
document.addEventListener('DOMContentLoaded', function () {
  lazyLoadImages('.lazy', { threshold: 0.7 });
  // lazyLoadInstance = new LazyLoad({
  //   callback_error: (img) => {
  //     const parentElem = img.parentElement;
  //     const newImg = document.createElement("img");
  //     const stubPath = img.getAttribute("data-stub") || "images/stub.svg";
  //     const stubAlt = img.getAttribute("data-stub-alt") || "Не удалось загрузить изображение";
  //     newImg.setAttribute("src", stubPath);
  //     newImg.setAttribute("alt", stubAlt);
  //     if (parentElem.tagName === "PICTURE") {
  //       parentElem.after(newImg);
  //       parentElem.remove();
  //     } else {
  //       img.after(newImg);
  //       img.remove();
  //     }
  //   }
  // });
  setTimeout(mapInit, 5000);
});
document.addEventListener('scroll', mapInitEvent);
document.addEventListener('mousemove', mapInitEvent);
document.addEventListener('touchstart', mapInitEvent);

window.addEventListener('load', init, false);
window.addEventListener('resize', onResizeFunctions, true);
let innerWidth = 0;
let permanentInnerHeight = 0;
let innerHeight = 0;
const blockedScrollElements = [];
function init() {
  innerWidth = window.innerWidth;
  permanentInnerHeight = window.innerHeight;
  innerHeight = window.innerHeight;
  updateWidthScrollbar();
  utils();
  checkVH();
  headerInit();

  bannersInit();
  popularInit();
  noveltiesInit();
  newsInit();
  reviewsInit();
  benefitsInit();
  catalogInit();
  productInit();
  warrantyInit();
  scheduleInit();
  promotionsInit();
  projectInit();
  historyInit();
  reviewsListInit();

  footerInit();

  resizeUtils();
  
  initSwipers('.hero__slider', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 4,
    speed: 1000,
    autoplay: {
      delay: 3000
    }
  });

  if (document.querySelector(".header-loc")) {
    const headerLoc = document.querySelector(".header-loc");
    const closeBtns = Array.from(headerLoc.querySelectorAll("[data-popup-close]"));
    closeBtns.forEach((el) => {
      el.addEventListener("click", (e) => {
        headerLoc.classList.add("header-loc--hidden");
        bodyFix(false);
      })
    })
  }
  const overlay = document.querySelector(".overlay");
  overlay.addEventListener("click", (e) => {
    const event = new Event("overlayClick", { bubbles: true });
    overlay.dispatchEvent(event);
  });
  
  if (document.querySelector(".product-preview")) { // PRODUCT page
    let bgSliders = [];
    let doorsSliders = [];
    const productPreview = document.querySelector(".product-preview");
    const isInterior = productPreview.classList.contains("product-preview--interior");
    const previewsWrapper = document.querySelector(".product-preview__previews");
    const previewsSwiperEl = previewsWrapper.querySelector(".swiper");
    const previewsSwiper = new Swiper(previewsSwiperEl, {
      slidesPerView: isInterior ? 5 : 3,
      spaceBetween: 12,
      slideToClickedSlide: true,
      breakpoints: {
        576: {
          slidesPerView: isInterior ? 5 : 4
        },
        768: {
          slidesPerView: isInterior ? 6 : 5
        },
        1280: {
          slidesPerView: isInterior ? 7 : 5,
          spaceBetween: 12
        },
      },
      navigation: {
        nextEl: previewsWrapper.querySelector(".swiper-button-next"),
        prevEl: previewsWrapper.querySelector(".swiper-button-prev")
      },      
    });
    const galleryWrapper = document.querySelector(".product-preview__gallery");
    const gallerySwiperEl = galleryWrapper.querySelector(".swiper");
    const gallerySwiper = new Swiper(gallerySwiperEl, {
      slidesPerView: 1,
      thumbs: {
        swiper: previewsSwiper
      },
    });
    gallerySwiper.on('slideChange', (swiper) => {
      const sourceSlide = previewsSwiper.slides[swiper.realIndex];
      const source = sourceSlide.querySelector('[data-constructor-door]');
      if (sourceSlide && source) {
        const pathToImg = source.dataset.constructorDoor || null;
        const targets = Array.from(document.querySelectorAll("[data-constructor-door-target]"));
        targets.forEach((target) => {
          if (pathToImg && target.hasAttribute("src")) {
            target.setAttribute("src", pathToImg);
          }
        });
      }
      document.dispatchEvent(new CustomEvent("constructorChangeDoor", {
        detail: {
          slideIndex: swiper.realIndex
        }
      }));
    });
    previewsSwiper.on('click', (swiper, event) => {
    });
    doorsSliders.push({ wrapper: previewsWrapper, swiper: previewsSwiper });
    //if (productPreview.querySelector(".product-backgrounds")) {
    //  const productBackgrounds = productPreview.querySelector(".product-backgrounds");
    //  const backgroundsSwiperEl = productBackgrounds.querySelector(".swiper");
    //  const backgroundsSwiper = new Swiper(backgroundsSwiperEl, {
    //    slidesPerView: 6,
    //    direction: "vertical",
    //    spaceBetween: 12,
    //    //slideToClickedSlide: true,
    //    //loop: true,
    //    //loopedSlides: 2,
    //    //loopAdditionalSlides: 2,
    //    navigation: {
    //      nextEl: productBackgrounds.querySelector(".swiper-button-next"),
    //      prevEl: null
    //      //prevEl: previewsWrapper.querySelector(".swiper-button-prev")
    //    },
    //  });
    //  bgSliders.push(backgroundsSwiper);
    //}
    if (document.querySelector(".product-constructor__slider--doors")) {
      const wrapper = document.querySelector(".product-constructor__slider--doors");
      const swiperEl = wrapper.querySelector(".swiper");
      const swiper = new Swiper(swiperEl, {
        slidesPerView: 5,
        //slidesPerView: "auto",
        spaceBetween: 8,
        //loop: true,
        //centeredSlides: true,
        //centeredSlidesBounds: false,
        //loopedSlides: 3,
        //slideToClickedSlide: true,
        //centerInsufficientSlides: true,
        navigation: {
          nextEl: wrapper.querySelector(".swiper-button-next"),
          prevEl: wrapper.querySelector(".swiper-button-prev")
        },
        breakpoints: {
          768: {
            slidesPerView: "auto",
            spaceBetween: 0,
            centredSlides: false,
            centeredSlidesBounds: false,
            centerInsufficientSlides: false,
          }
        }
      });
      swiper.on('click', (swiper, event) => {
        if (event.target.closest(".product-slide")) {
          swiper.slides.forEach(slide => slide.querySelector(".product-slide").classList.remove('product-slide-active'));
          event.target.closest(".product-slide").classList.add('product-slide-active');
        }
        document.dispatchEvent(new CustomEvent("constructorChangeDoor", {
          detail: {
            slideIndex: swiper.clickedIndex
          }
        }));
      });
      doorsSliders.push({ wrapper, swiper });
    }
    if (document.querySelector(".product-constructor__slider--backgrounds")) {
      const wrappers = Array.from(document.querySelectorAll(".product-constructor__slider--backgrounds"));
      wrappers.forEach((wrapper) => {
        let swiperEl;
        let swiper;
        swiperEl = wrapper.querySelector(".swiper");
        if (wrapper.closest(".product-backgrounds")) {
          swiper = new Swiper(swiperEl, {
            slidesPerView: "auto",
            direction: "vertical",
            slideToClickedSlide: true,
            //centeredSlides: true,
            //centeredSlidesBounds: true,
            //centerInsufficientSlides: true,
            spaceBetween: 2,
            navigation: {
              nextEl: wrapper.querySelector(".swiper-button-next"),
              prevEl: wrapper.querySelector(".swiper-button-prev")
            },
            
          });
        } else {
          swiper = new Swiper(swiperEl, {
            slidesPerView: 3,
            direction: "horizontal",
            slideToClickedSlide: true,
            centeredSlides: true,
            centeredSlidesBounds: true,
            centerInsufficientSlides: true,
            spaceBetween: 2,
            navigation: {
              nextEl: wrapper.querySelector(".swiper-button-next"),
              prevEl: wrapper.querySelector(".swiper-button-prev")
            },
            breakpoints: {
              768: {
                direction: "vertical",
                slidesPerView: "auto",
              }
            }
          });
        }
        swiper.on('click', (swiper, event) => {
          console.log(swiper)
          if (event.target.closest(".product-slide")) {
            swiper.slides.forEach(slide => slide.querySelector(".product-slide").classList.remove('product-slide-active'));
            event.target.closest(".product-slide").classList.add('product-slide-active');
            document.dispatchEvent(new CustomEvent("constructorChangeBg", {
              detail: {
                slideIndex: swiper.clickedIndex
              }
            }));
          }
        });
        bgSliders.push({ wrapper, swiper });
      });
    }
    document.addEventListener("constructorChangeBg", (e) => {
      if (e.detail) {
        bgSliders.forEach(({ wrapper, swiper }) => {
          const innerSlides = wrapper.querySelectorAll(".product-slide");
          innerSlides.forEach((slide, index) => {
            slide.classList.remove('product-slide-active');
            if (index === e.detail.slideIndex) {
              slide.classList.add('product-slide-active');
            }
          });
          //swiper.slideTo(e.detail.slideIndex);
          //swiper.slides.forEach((slide, index) => {
          //  //console.log(slide)
          //  slide.querySelector(".product-slide").classList.remove('product-slide-active');
          //  if (index === e.detail.slideIndex) {
          //    slide.querySelector(".product-slide").classList.add('product-slide-active');
          //  }
          //});
          
        });
        //console.log(e.detail.slideIndex)
      }
    });
    document.addEventListener("constructorChangeDoor", (e) => {
      if (e.detail) {
        gallerySwiper.slideTo(e.detail.slideIndex)
        doorsSliders.forEach(({ wrapper, swiper }) => {
          const innerSlides = wrapper.querySelectorAll(".product-slide");
          innerSlides.forEach((slide, index) => {
            slide.classList.remove('product-slide-active');
            if (index === e.detail.slideIndex) {
              slide.classList.add('product-slide-active');
            }
          });
        });
      }
    });
  }

  initCardsSliders();
  const favouriteArrow = document.querySelector(".favourite__arrow");
  if (favouriteArrow) {
    favouriteArrow.addEventListener("click", (e) => {
      e.preventDefault();
      favouriteArrow.parentElement.classList.toggle("smallest");
    })
  }
  if (document.querySelector(".card--office .card-example")) {
    const examples = Array.from(document.querySelectorAll(".card--office .card-examples"));
    //console.log(examples)
    examples.forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".card-example__title")) {
          //console.log("targ")
          e.target.closest(".card-example__title").parentElement.classList.toggle("opened");
        }
      })
    })
  }
  const btnTop = document.querySelector(".btn--to-top");
  if (btnTop) {
    btnTop.addEventListener("click", () => {
      window.scrollTo(scrollX, 0);
    })
  } 
  if (document.querySelector(".compare-row--chars")) {
    const compareCharsRow = document.querySelector(".compare-row--chars");
    const allLists = Array.from(document.querySelectorAll(".compare-list__list"));
    compareCharsRow.addEventListener("mouseover", (e) => {
      if (e.target.closest(".compare-list__item")) {
        const item = e.target.closest(".compare-list__item");
        const index = Array.from(item.parentElement.children).indexOf(item);
        allLists.forEach((list) => {
          list.children[index].classList.add("hover");
        })
      }
    })
    compareCharsRow.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("compare-list__item")) {
        const item = e.target.closest(".compare-list__item");
        const index = Array.from(item.parentElement.children).indexOf(item);
        allLists.forEach((list) => {
          list.children[index].classList.remove("hover");
        })
      }
    })
  }
  if (document.querySelector(".compare-swiper")) {
    const options = {
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 2,
        },
        1300: {
          slidesPerView: 3,
        },
      }
    };
    const optionsDoors = Object.assign(options, {
      navigation: {
        nextEl: document.querySelector(".compare-row--doors .swiper-buttons--sm .swiper-button-next"),
        prevEl: document.querySelector(".compare-row--doors .swiper-buttons--sm .swiper-button-prev")
      },
    })
    const swiperDoors = new Swiper(".compare-swiper--doors", optionsDoors);
    const swiperChars = new Swiper(".compare-swiper--chars", options);
    swiperDoors.controller.control = swiperChars;
    swiperChars.controller.control = swiperDoors;

  }
  //initSwipers(".card--mono .card-gallery__previews .swiper", {
  //  slidesPerView: 3,
  //  autoHeight: true,
  //  spaceBetween: 4,
  //  loop: true,
  //  centeredSlides: true,
  //  loopAdditionalSlides: 1,
  //});
  const callback = document.querySelector(".callback");
  if (callback) {
    console.log(callback)
    const triggerOpen = callback.querySelector(".callback__open");
    const triggerClose = callback.querySelector(".callback__close");
    const body = callback.querySelector(".callback__wrapper");
    const callbackOpen = () => {
      console.log(body)
      gsap.to(body, {
        height: "auto",
      });
    }
    const callbackClose = () => {
      console.log(body)
      gsap.to(body, {
        height: 0,
      });

    }
    triggerOpen.addEventListener("click", callbackOpen);
    triggerClose.addEventListener("click", callbackClose);
  }
  //if (document.querySelector(".menu-list")) {
  //  const menuLists = Array.from(document.querySelectorAll(".menu-list"));
  //  menuLists.forEach((list) => {
  //    let isAnimated = false;
  //    function openDrop(item) {

  //      const body = item.querySelector(".menu-item__body");
  //      isAnimated = true;
  //      gsap.fromTo(body, {
  //        height: 0,
  //      }, {
  //        height: "auto",
  //        duration: .4,
  //        onStart: () => {
  //          item.classList.add("opened");
  //        },
  //        onComplete: () => {
  //          isAnimated = false;
  //        }
  //      });
  //    }
  //    function closeDrop(item) {

  //      const body = item.querySelector(".menu-item__body");
  //      isAnimated = true;
  //      gsap.to(body, {
  //        height: 0,
  //        duration: .4,
  //        onStart: () => {
  //          item.classList.remove("opened");
  //        },
  //        onComplete: () => {
  //          isAnimated = false;
  //        }
  //      });
  //    }

  //    function toggleDrop(item) {
  //      if (item.classList.contains("opened")) {
  //        closeDrop(item);
  //      } else {
  //        openDrop(item);
  //      }
  //    }

  //    list.addEventListener("click", (e) => {
  //      if (isAnimated) return;
  //      const trigger = e.target.closest(".menu-item__trigger");
  //      if (trigger) {
  //        const body = trigger.parentElement.parentElement.querySelector(".menu-item__body");
  //        if (body) {
  //          //e.preventDefault();
  //          toggleDrop(trigger.parentElement.parentElement);
  //        }
  //      }
  //    })
  //  })  
    
  //}
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    let activeBtns = Array.from(mobileMenu.querySelectorAll(".mobile-menu__item>[data-open-window]"));
    const filterBtn = document.querySelector(".breadcrumbs__filter");
    let isHeaderFixed = false;
    const handleMobileMenu = (e) => {
      const closeBtn = e.target.closest("[data-close-window]");
      const openBtn = e.target.closest("[data-open-window]");
      if (closeBtn) {
        const target = document.querySelector(`#${closeBtn.dataset.closeWindow}`);
        target.classList.remove("mobile-window--opened");
        Array.from(document.querySelectorAll(`[data-open-window="${closeBtn.dataset.closeWindow}"]`)).forEach((el) => el.classList.remove("active"));
      }
      if (openBtn) {
        const target = document.querySelector(`#${openBtn.dataset.openWindow}`);
        target.classList.toggle("mobile-window--opened");
        if (target.classList.contains("mobile-window--opened")) {
          openBtn.classList.add("active");
        } else {
          openBtn.classList.remove("active");
        }
      }
      const activeBtn = activeBtns.filter((btn) => btn.classList.contains("active"));
      if (activeBtn && activeBtn.length > 0 && !isHeaderFixed) {
        isHeaderFixed = true;
        bodyFix(true);
      }
      if ((!activeBtn || activeBtn.length === 0) && isHeaderFixed) {
        Array.from(document.querySelectorAll(".mobile-window--opened")).forEach((el) => el.classList.remove("mobile-window--opened"));
        isHeaderFixed = false;
        bodyFix(false);
      }
    }
    mobileMenu.addEventListener("click", handleMobileMenu);
    if (filterBtn) filterBtn.addEventListener("click", handleMobileMenu);
  }

  const menuPopup = document.querySelector(".menu-popup");
  const menuPopupTrigger = document.querySelector(".title__burger");
  const menuPopupClose = document.querySelector(".menu-popup__close");
  const isLayoutWithoutSidebar = document.querySelector(".layout--without-sidebar");
  if (menuPopup && menuPopupTrigger && menuPopupClose && isLayoutWithoutSidebar) {
    let isOpened = false;
    function openMenuPopup(e) {
      isOpened = true;
      manageOverlay('medium');
      menuPopup.classList.add("opened");
    }
    function closeMenuPopup(e) {
      isOpened = false;
      menuPopup.classList.remove("opened");
      manageOverlay('none');
    }
    menuPopupTrigger.addEventListener("click", openMenuPopup);
    menuPopupClose.addEventListener("click", closeMenuPopup);
    document.addEventListener("overlayClick", () => {
      if (isOpened) closeMenuPopup();
    });
  }
  //manageOverlay('low');
  //manageOverlay('none');
  dropdownInit();
  document.addEventListener("click", (e) => {
    if (e.target.closest(".catalog__filter-hidden")) {
      const wrapper = e.target.closest(".catalog__filter");
      const btn = e.target.closest(".catalog__filter-hidden");
      const btnText = btn.querySelector("span");
      if (wrapper) {
        const hiddenElems = Array.from(wrapper.querySelectorAll(".hidden"));
        const openedElems = Array.from(wrapper.querySelectorAll(".is-opened"));
        if (hiddenElems.length > 0) {
          hiddenElems.forEach((el) => {
            el.classList.remove("hidden");
            el.classList.add("is-opened");
          });
          btnText.dataset.changeText = btnText.textContent;
          btnText.textContent = "Скрыть";
          btn.classList.add("is-opened");
        } else if (openedElems.length > 0) {
          openedElems.forEach((el) => {
            el.classList.add("hidden");
            el.classList.remove("is-opened");
          });
          btnText.textContent = btnText.dataset.changeText;
          btnText.dataset.changeText = "";
          btn.classList.remove("is-opened");
        }
      }
    }

    if (e.target.closest("[data-dropdown]")) {
      const trigger = e.target.closest("[data-dropdown]");
      dropdownToggle(trigger);
    }
    if (e.target.closest(".offices-view__btn")) {
      const target = e.target.closest(".offices-view__btn");
      if (!target.classList.contains("active") && target.id === "view-list") {
        Array.from(document.querySelectorAll(".offices-view__btn")).forEach((el) => el.classList.remove("active"));
        target.classList.add("active");
        gsap.set(".offices-balloon--list", {
          display: "block"
        });
        gsap.set(".offices-balloon:not(.offices-balloon--list)", {
          display: "none"
        });
        gsap.set("#map", {
          display: "none"
        });
        gsap.set(".offices__panel", {
          display: "none"
        });
      }
      if (!target.classList.contains("active") && target.id === "view-map") {
        Array.from(document.querySelectorAll(".offices-view__btn")).forEach((el) => el.classList.remove("active"));
        target.classList.add("active");
        gsap.set(".offices-balloon--list", {
          display: "none"
        });
        gsap.set("#map", {
          display: "block"
        });
        gsap.set(".offices__panel", {
          display: "block"
        });
        gsap.set(".offices-balloon:not(.offices-balloon--list)", {
          display: "block"
        });
      }
    }
    if (e.target.closest(".metering-popup__close") || e.target.closest(".metering-popup__submit")) {
      const popup = e.target.closest(".metering-popup");
      popup.classList.remove("active");
    }
    if (e.target.closest(".attention-overlay.active")) {
      const popup = e.target.closest(".attention-overlay.active");
      popup.classList.remove("active");
    }
    if (e.target.closest("[data-popup-open]")) {
      const trigger = e.target.closest("[data-popup-open]");
      const id = trigger.dataset.popupOpen || "";
      const popup = document.querySelector(`#${id}`);
      if (id && popup) {
        if (id === "popup-loupe") {
          const popupImg = popup.querySelector("img");
          // card
          if (e.target.closest(".card")) {
            const card = e.target.closest(".card");
            const img = card.querySelector(".card-main .swiper-slide-active img");
            let src = img.getAttribute("src");
            if (img.hasAttribute("data-loupe-image")) {
              src = img.dataset.loupeImage;
            }
            popupImg.setAttribute("src", src);
          }
          // detail
          if (e.target.closest(".product-gallery__image")) {
            const imageSlide = e.target.closest(".product-gallery__image");
            const img = imageSlide.querySelector("img");
            let src = img.getAttribute("src");
            if (img.hasAttribute("data-loupe-image")) {
              src = img.dataset.loupeImage;
            }
            popupImg.setAttribute("src", src);
          }
          //if (e.target.closest(".is-constructor")) return;
          gsap.to(popup, {
            autoAlpha: 1,
            onStart: () => {
              bodyFix(true);
              gsap.set(popup, {
                display: "flex",
              })
            }
          })
        } else {
          gsap.to(popup, {
            autoAlpha: 1,
            onStart: () => {
              bodyFix(true);
              gsap.set(popup, {
                display: "flex",
              })
            }
          })
        }
      }
    }
    if (e.target.closest("[data-popup-close]") && !e.target.closest(".product-constructor")) {
      const popup = e.target.closest(".popup-loupe");
      gsap.to(popup, {
        autoAlpha: 0,
        onComplete: () => {
          gsap.set(popup, {
            display: "none",
          })
          bodyFix(false);
        }
      })
    }
    if (e.target.closest("[data-subpopup-open]")) {
      const openBtn = e.target.closest("[data-subpopup-open]");
      const subpopup = e.target.closest("[data-subpopup]");
      if (subpopup) {
        const window = subpopup.querySelector("[data-subpopup-window]");
        if (window) {
          gsap.to(window, {
            autoAlpha: 1,
            onStart: () => {
              bodyFix(true);
              gsap.set(window, {
                display: "flex",
              })
            }
          });
        }
      }
    }
    if (e.target.closest("[data-subpopup-close]")) {
      const closeBtn = e.target.closest("[data-subpopup-close]");
      const subpopup = e.target.closest("[data-subpopup]");
      if (subpopup) {
        const window = subpopup.querySelector("[data-subpopup-window]");
        if (window) {
          gsap.to(window, {
            autoAlpha: 0,
            onComplete: () => {
              bodyFix(false);
              gsap.set(window, {
                display: "flex",
              })
            }
          });
        }
      }
    }
    if (e.target.closest(".product-options__item")) {
      const itemTarget = e.target.closest(".product-options__item");
      const subpopup = e.target.closest("[data-subpopup]");
      const viewActiveTextElem = subpopup.querySelector("[data-subpopup-active]");
      if (subpopup && !itemTarget.classList.contains("active")) {
        const items = Array.from(subpopup.querySelectorAll(".product-options__item"));
        items.forEach((item) => {
          item.classList.remove("active");
        });
        itemTarget.classList.add("active");
        if (viewActiveTextElem) {
          viewActiveTextElem.textContent = itemTarget.textContent;
        }
      }
      
    }
  })
}

function onResizeFunctions() {
  headerInit();
  updateWidthScrollbar();
  resizeUtils();
  if (innerWidth !== window.innerWidth) {
    innerWidth = window.innerWidth;
    permanentInnerHeight = checkVH();
    bodyFix(false);
  }
  if (innerHeight !== window.innerHeight) {
    innerHeight = window.innerHeight;
    checkVH();

  }
}
function bodyFixPosition() {
  setTimeout(() => {
    if (!document.body.hasAttribute("data-body-scroll-fix")) {
      isBodyFixed = true;
      let scrollPos = window.scrollY || document.documentElement.scrollTop;

      document.body.setAttribute("data-body-scroll-fix", scrollPos);
      document.body.classList.add("fixed");
      document.documentElement.classList.add("fixed");
      document.body.style.top = `-${scrollPos}px`;
      // Коррекция скролла
      //if (widthScrollBar > 0)
      //  document.body.style.paddingRight = `${widthScrollBar}px`;

      document.dispatchEvent(new Event("bodyFixed"));
    }
  }, 18);
};
function bodyUnfixPosition() {
  if (document.body.hasAttribute("data-body-scroll-fix")) {
    let scrollPos = document.body.getAttribute("data-body-scroll-fix");
    document.body.removeAttribute("data-body-scroll-fix");
    document.body.classList.remove("fixed");
    document.documentElement.classList.remove("fixed");
    document.body.style.top = "";
    document.body.style.paddingRight = "";
    window.scroll(0, scrollPos);
    isBodyFixed = false;
    document.dispatchEvent(new Event("bodyUnfixed"));
  }
};

function bodyFix(value) {
  if (!!value) {
    bodyFixPosition();
  } else {
    bodyUnfixPosition();
  }
};

function utils() {
    const popupCallLinks = document.querySelectorAll('[data-popup]');
    popupCallLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const popup = document.querySelector('.popup[data-popup-id="' + link.getAttribute('data-popup') + '"]');
            if (popup) {
                popup.classList.add('active');
                bodyFix(true);
                const popupInput = popup.querySelector('input[type="text"]');
                if (popupInput)
                    popupInput.focus();
                setTimeout(function () {
                    popup.style.opacity = '1';
                }, 2);
            }
        });
    });

    document.addEventListener('click', (e) => {
        const inPopup = e.target.closest('.popup__wrapper');
        const popup = e.target.closest('.popup');
        if (!inPopup && (getStyle(popup, 'display') == 'flex' || getStyle(popup, 'display') == 'block')) {
            closePopup(popup);
        }

        const scrollTopButton = e.target.closest('.scrollTop');
        if (scrollTopButton) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    });

    const popupCloseButtons = document.querySelectorAll('.popup__close');
    popupCloseButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const popup = btn.closest('.popup');
            closePopup(popup);
        });
    });

    Array.prototype.forEach.call(
        document.querySelectorAll('.scrollarea'),
        (el) => new PerfectScrollbar(el, {
            wheelSpeed: .5,
            suppressScrollX: true
        })
    );

    const hiddenLinks = document.querySelectorAll('.hidden__link');
    hiddenLinks.forEach(link => {
        link.addEventListener('click', function () {
            const items = link.parentElement.querySelector('.hidden__items');
            link.classList.toggle('expanded');
            items.classList.toggle('expanded');
        });
    });

    const readmoreButtons = document.querySelectorAll('.readmore__button');
    readmoreButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            btn.closest('.readmore__content').classList.add('readmore__content--visible');
        });
    });

    const selects = Array.from(document.querySelectorAll('.select'));
    selects.forEach(select => {
        const selectedOption = select.querySelector('option:checked');
        if (selectedOption) {
            if (!selectedOption.getAttribute('data-placeholder'))
                select.classList.add('active');    
        }
        
        const slimEx = new SlimSelect({
            select: select,
            settings: {
                showSearch: false,
                openPosition: 'down',
                contentLocation: document.querySelector('.layout')
            },
            events: {
                beforeChange: (value, old) => {
                    if (value)
                        select.nextElementSibling.classList.add('active');
                }
            }
        });
        select.open = slimEx.open.bind(slimEx);
        select.close = slimEx.close.bind(slimEx);
        select.destroy = slimEx.destroy.bind(slimEx);
        select.setSelected = slimEx.setSelected.bind(slimEx);
        select.getSelected = slimEx.getSelected.bind(slimEx);
    });

    Array.prototype.forEach.call(
        document.querySelectorAll('.ss-list'),
        (el) => new PerfectScrollbar(el, {
            wheelSpeed: .5,
            suppressScrollX: true
        })
    );

    const tabs = document.querySelectorAll('.tabs');
    tabs.forEach(wrapper => {
        const tabsLinks = wrapper.querySelectorAll('.tabs__link');
        const tabsContents = wrapper.querySelectorAll('.tabs__content');
        tabsLinks.forEach((link, i) => {
            link.addEventListener('click', function () {
                tabsLinks.forEach(l => l.classList.remove('active'));
                tabsContents.forEach(c => c.classList.remove('active'));
                tabsLinks[i].classList.add('active');
                tabsContents[i].classList.add('active');
            });
        });
    });

    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        const emptyWrapper = input.closest('.empty__wrapper');
        const placeholder = input.parentElement.querySelector('.form__placeholder');

        if (placeholder && !input.value)
            placeholder.style.display = 'block';

        input.addEventListener('input', function (e) {
            if (emptyWrapper) {
                const emptyLabel = emptyWrapper.querySelector('.empty__label');
                const valueWidth = getTextWidth(input.value, getCanvasFont(input));
                const inputWidth = input.getBoundingClientRect().width - getStyle(input, 'padding-left') - getStyle(input, 'padding-right');
                const labelWidth = emptyLabel.getBoundingClientRect().width;
                if (inputWidth - labelWidth >= valueWidth) {
                    emptyLabel.style.opacity = 1;
                    emptyLabel.style.left = valueWidth + getStyle(input, 'padding-left') + 'px';
                } else {
                    emptyLabel.style.opacity = 0;
                }
            }

            if (placeholder) {
                if (input.value && input.value !== '+ 375 ')
                    placeholder.style.display = 'none';
                else
                    placeholder.style.display = 'block';
            }
        });
    });

    const rangeSliders = document.querySelectorAll('.range__wrapper');
    rangeSliders.forEach(slider => {
        if (!slider.hasAttribute("data-range-type")) {
          const rangeInputs = slider.closest('.range__container').querySelectorAll('[data-range-input]');
          let min = parseFloat(slider.getAttribute('data-range-min')) || 1;
          let max = parseFloat(slider.getAttribute('data-range-max')) || 100;
          const step = parseFloat(slider.getAttribute('data-range-step')) || 1;
          const value = slider.getAttribute('data-range-value') ? slider.getAttribute('data-range-value').split(':').map((v) => parseFloat(v)) : [min, max];
          if (min > value[0])
              min = value[0];
          if (max < value[1])
              max = value[1];
          noUiSlider.create(slider, {
              start: value,
              connect: true,
              step: step,
              range: {
                  'min': min,
                  'max': max
              },
              format: {
                  to: function (value) {
                      return parseInt(value);
                  },
                  from: function (value) {
                      return parseInt(value);
                  }
              }
          });
          slider.noUiSlider.on('update', function (values) {
              values.forEach((val, i) => rangeInputs[i].value = val);
              slider.setAttribute('data-range-value', values.join(':'));
          });
          rangeInputs.forEach(input => {
              input.addEventListener('change', function () {
                  this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                  const values = Array.from(rangeInputs).map(i => i.value);
                  slider.noUiSlider.set(values);
              });
          });
        }
    });
    const rangeTypeSliders = document.querySelectorAll('[data-range-type]');
    rangeTypeSliders.forEach(slider => {
        const rangeInputs = slider.closest('.range__container').querySelectorAll('[data-range-input]');
        let min = parseFloat(slider.getAttribute('data-range-min')) || 1;
        let max = parseFloat(slider.getAttribute('data-range-max')) || 100;
        const step = parseFloat(slider.getAttribute('data-range-step')) || 1;
        const value = slider.getAttribute('data-range-value') ? slider.getAttribute('data-range-value').split(':').map((v) => parseFloat(v)) : [min, max];
        const orientation = slider.getAttribute('data-range-orientation') || "horizontal";
        if (min > value[0])
            min = value[0];
        if (max < value[1])
            max = value[1];
        noUiSlider.create(slider, {
            start: value,
            connect: [true, false],
            step: step,
            orientation,
            tooltips: true,
            direction: orientation === "vertical" ? 'rtl' : "ltr",
            range: {
                'min': min,
                'max': max
            },
            format: {
                to: function (value) {
                    return parseInt(value);
                },
                from: function (value) {
                    return parseInt(value);
                }
            }
        });
        slider.noUiSlider.on('update', function (values) {
            values.forEach((val, i) => rangeInputs[i].value = val);
            slider.setAttribute('data-range-value', values.join(':'));
        });
        rangeInputs.forEach(input => {
            input.addEventListener('change', function () {
                this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                const values = Array.from(rangeInputs).map(i => i.value);
                slider.noUiSlider.set(values);
            });
        });
    });
    

    const phoneInputs = document.querySelectorAll('.phone-input, [name="phone"], input[type="tel"]');
    phoneInputs.forEach(input => {
        const mask = IMask(input, {
            mask: '+ {375} (00) 000-00-00'
        });
    });

    const accordionsHeadings = document.querySelectorAll('.accordion__heading');
    accordionsHeadings.forEach(heading => {
        const accordion = heading.closest('.accordion');
        const subAccordions = accordion.querySelectorAll('.accordion');
        if (subAccordions.length === 1) {
            const a = subAccordions[0];
            a.classList.toggle('active');
            const content = a.querySelector('.accordion__content');
            content.style.maxHeight = content.scrollHeight + "px";
        }
        heading.addEventListener('click', function () {
            accordion.classList.toggle('active');
            const content = accordion.querySelector('.accordion__content');
            const parentAccordion = accordion.closest('.accordion__content');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                if (parentAccordion)
                    parentAccordion.style.maxHeight = parentAccordion.scrollHeight + content.scrollHeight + "px";
            }
        });
    });

    const files = document.querySelectorAll('.file');
    files.forEach(file => {
        const nameLabel = file.querySelector('.file__name');
        const name = nameLabel.querySelector('.file__name-value');
        const placeholder = nameLabel.getAttribute('data-placeholder');
        name.innerText = placeholder;

        const input = file.querySelector('input[type="file"]');
        input.addEventListener('change', function () {
            if (input.files.length) {
                const fullFileName = input.files[0].name.split('.');
                file.classList.add('uploaded');
                name.innerText = fullFileName[0];
                nameLabel.setAttribute('data-extension', '.' + fullFileName[1]);
            } else {
                resetFile();
            }
            fitFileValue(name, nameLabel);
        });

        const resetButton = file.querySelector('.file__reset');
        resetButton.addEventListener('click', resetFile);

        function resetFile() {
            nameLabel.removeAttribute('data-extension');
            file.classList.remove('uploaded');
            name.innerText = placeholder;
            input.value = '';
        }
    });

    const messageToggleButtons = document.querySelectorAll('.message__toggle');
    messageToggleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const message = this.closest('.message');
            const hidden = message.querySelector('.message__hidden');
            this.classList.toggle('active');
            if (hidden.style.maxHeight) {
                hidden.style.maxHeight = null;
            } else {
                hidden.style.maxHeight = hidden.scrollHeight + 'px';
            }
        });
    });

    const datepickers = document.querySelectorAll('.datepicker');
    datepickers.forEach(date => {
        const datepickerOptions = {
            position: 'br',
            showAllDates: true,
            startDay: 1,
            customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            customOverlayMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            overlayButton: 'Выбрать',
            overlayPlaceholder: 'Год',
            onShow: (instance) => {
                instance.parent.classList.add('opened');
            },
            onHide: (instance) => {
                const input = instance.el;
                instance.parent.classList.remove('opened');
                if (input.value)
                    input.classList.add('active');
                else
                    input.classList.remove('active');
            },
            formatter: (input, date, instance) => {
                const d = date.getDate();
                const m = date.getMonth() + 1;
                const day = d < 10 ? '0' + d : d;
                const month = m < 10 ? '0' + m : m;
                const year = date.getFullYear();
                input.value = day + '.' + month + '.' + year;
            }
        };
        const dateOptions = ['minDate', 'maxDate', 'startDate'];
        dateOptions.forEach(option => {
            const attr = 'data-' + option;
            if (date.hasAttribute(attr)) {
                let optionValue = new Date();
                const attrValue = date.getAttribute(attr);
                if (attrValue)
                    optionValue = new Date(attrValue);
                if (optionValue instanceof Date && !isNaN(optionValue))
                    datepickerOptions[option] = optionValue;
            }
        });
        datepicker(date, datepickerOptions);
    });

    Fancybox.bind('[data-fancybox]', {
        wheel: false,
    });

    const filter = document.querySelector('.filter');
    if (filter) {
        const filterHasChildrenLinks = filter.querySelectorAll('li.has-children');
        filterHasChildrenLinks.forEach((link, i) => {
            const anchor = link.children[0] ? link.children[0] : link;
            anchor.addEventListener('click', function() {
                link.classList.toggle('active');
            });
        });

        const filterCloseButton = filter.querySelector('.filter-close');
        filterCloseButton.addEventListener('click', () => filter.classList.remove('active'));

        const filterOpenButton = document.querySelector('.filter-button');
        filterOpenButton.addEventListener('click', () => filter.classList.add('active'));
    }

    const reviewForms = document.querySelectorAll('.form__rating');
    reviewForms.forEach(form => {
        const ratingStars = form.querySelector('.form__rating-stars');
        const stars = ratingStars.querySelectorAll('.star');
        stars.forEach((star, i) => {
            star.onmouseover = function () {
                setRating(i + 1, form);
            }
            star.onclick = function () {
                ratingStars.setAttribute('data-value', i + 1);
                setRating(i + 1, form);
            }
        });
        ratingStars.onmouseout = function () {
            const currentStar = ratingStars.getAttribute('data-value') ?? 0;
            setRating(currentStar, form);
        }
    });
    function setRating(rating, form) {
        const ratingStars = form.querySelector('.form__rating-stars');
        const input = form.querySelector('.form__rating-input');
        const stars = ratingStars.querySelectorAll('.star');
        input.value = rating;
        stars.forEach((star, i) => {
            if (i < rating)
                star.classList.add('filled');
            else
                star.classList.remove('filled');
        });
    }

    initSwipers('.gallery-slider', {
        slidesPerView: 1,
        spaceBetween: 10,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            575: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 3,
            },
        }
    });
    if (document.querySelector("[data-constructor-background-target]")) {
      initConstructor();
    }
}

function resizeUtils() {
    const container = document.querySelector('.container');
    if (container) {
        let containerWidth = 0;
        const containers = document.querySelectorAll('.container');
        containers.forEach(c => {
            const width = getWidth(c);
            if (width > containerWidth)
                containerWidth = width;
        });
        const containerPaddings = parseFloat(getStyle(container, 'padding-left')) + getStyle(container, 'padding-right');
        const containerOffsetWidth = containerWidth - containerPaddings;
        document.documentElement.style.setProperty('--container-offset', Math.ceil((document.body.clientWidth - containerOffsetWidth + 2) / 2) + 'px');
    }

    const utilsContainers = document.querySelectorAll('[data-container]');
    utilsContainers.forEach(c => {
        const containerIsHidden = getStyle(c, 'display') === 'none';
        if (containerIsHidden)
            c.style.display = 'block';
        const equalHeightElements = c.querySelectorAll('.eq-h');
        if (equalHeightElements.length) {
            let maxHeight = 0;
            equalHeightElements.forEach(el => {
                el.style.height = 'auto';
                const elHeight = el.getBoundingClientRect().height;
                if (elHeight > maxHeight)
                    maxHeight = elHeight;
            });
            equalHeightElements.forEach(el => el.style.height = maxHeight + 'px');
        }

        const equalWidthElements = c.querySelectorAll('.eq-w');
        if (equalWidthElements.length && window.matchMedia('(min-width: 576px)').matches) {
            let maxWidth = 0;
            equalWidthElements.forEach(el => {
                el.style.width = 'auto';
                const elWidth = el.getBoundingClientRect().width;
                if (elWidth > maxWidth)
                    maxWidth = elWidth;
            });
            equalWidthElements.forEach(el => el.style.width = maxWidth + 'px');
        }

        const hintElements = c.querySelectorAll('[data-hint]');
        hintElements.forEach(el => {
            el.onmouseenter = function () {
                const hints = c.querySelectorAll('.hint');
                hints.forEach(h => h.remove());

                const hint = document.createElement('span');
                hint.classList.add('hint');
                hint.innerHTML = el.getAttribute('data-hint') + '<span class="hint__decor"></span>';
                c.appendChild(hint);

                const hintDimensions = {
                    width: getWidth(hint)
                };
                const hintPosition = {
                    left: el.offsetLeft + getWidth(el) / 2 - hintDimensions.width / 2
                };
                if (hintPosition.left + hintDimensions.width > window.innerWidth - 5) {
                    hintPosition.left = window.innerWidth - 5 - hintDimensions.width;
                    hint.style.right = '5px';
                    hint.classList.add('oversized');
                }
                if (hintPosition.left < 5) {
                    hint.style.left = '5px';
                    hint.classList.add('oversized');
                } else {
                    hint.style.left = hintPosition.left + 'px';
                }

                hintDimensions.height = getHeight(hint);
                hintPosition.top = el.offsetTop - hintDimensions.height - 11;
                hint.style.top = hintPosition.top + 'px';

                const hintDecor = hint.querySelector('.hint__decor');
                hintDecor.style.left = el.offsetLeft + getWidth(el) / 2 - getStyle(hint, 'left') + 'px';

                hint.classList.add('active');
            }
            el.onmouseleave = function () {
                const hints = c.querySelectorAll('.hint');
                hints.forEach(h => h.remove());
            }
        });

        const formLabels = document.querySelectorAll('.form__field-label');
        formLabels.forEach(label => {
            const field = label.closest('.form__field');
            if (field) {
                if (getStyle(field, 'align-items') === 'center') {
                    const hint = field.querySelector('.form__hint');
                    if (hint) {
                        label.style.marginTop = ((getHeight(hint) || 15) + getStyle(hint, 'margin-top')) * -1 + 'px';
                    }
                }
            }
        });

        if (containerIsHidden)
            c.style.display = null;
    });

    const files = document.querySelectorAll('.file');
    files.forEach(file => {
        const nameLabel = file.querySelector('.file__name');
        const name = nameLabel.querySelector('.file__name-value');
        fitFileValue(name, nameLabel);
    });

    const productItemsDetails = document.querySelectorAll('.product-item__details');
    productItemsDetails.forEach(el => {
        const item = el.closest('.product-item');
        const transition = parseFloat(getStyle(item, 'transition-duration')) * 1000 || 200;
        setTimeout(function () {
            el.style.paddingTop = getHeight(item) - 16 + 'px';
        }, transition);
    });

    const popularImages = document.querySelectorAll('.popular__items .popular__col-image');
    popularImages.forEach(p => {
        p.style.width = 'auto';
        const image = p.querySelector('img');
        const width = image.getBoundingClientRect().width;
        if (width > 0)
            p.style.width = width + 'px';
    });
}

function checkVH() {
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  return vh;
}

function headerInit() {
    const header = document.querySelector('.header');
    if (header) {
        const menu = header.querySelector('.header__menu');
        let submenuElements = [];
        let hasChildrenItems = [];
        if (menu) {
          submenuElements = Array.from(menu.querySelectorAll('.header__submenu'));
          hasChildrenItems = Array.from(menu.querySelectorAll('li.has-children'));
          menu.onmouseleave = function () {
              hasChildrenItems.forEach(i => i.classList.remove('hover'));
              submenuElements.forEach(el => el.style.display = 'none');
              manageOverlay('none');
          };
          hasChildrenItems.forEach(item => {
              const submenu = item.querySelector('.header__submenu');
              if (submenu) {
                  item.onmouseenter = function () {
                      hasChildrenItems.forEach(i => i.classList.remove('hover'));
                      item.classList.add('hover');
                      submenuElements.forEach(el => el.style.display = 'none');
                      submenu.style.display = 'block';
                      manageOverlay('low');
                  };
              }
          });
        }

        if (header.querySelector(".header__top")) {

          const topMenu = header.querySelector('.header__top-wrapper');
          const topHasChildrenItems = Array.from(topMenu.querySelectorAll('li.has-children'));
          const topSubmenuElements = topMenu.querySelectorAll('li.has-children > ul');
          topMenu.onmouseleave = function () {
              topHasChildrenItems.forEach(i => i.classList.remove('hover'));
              topSubmenuElements.forEach(el => el.style.display = 'none');
          };
          topHasChildrenItems.forEach(item => {
              const submenu = item.querySelector('ul');
              if (submenu) {
                  item.onmouseenter = function () {
                      topHasChildrenItems.forEach(i => i.classList.remove('hover'));
                      item.classList.add('hover');
                      topSubmenuElements.forEach(el => el.style.display = 'none');
                      submenu.style.display = 'block';
                  };
              }
          });
          const topGrandchildItems = topMenu.querySelectorAll('li.has-grandchild');
          topGrandchildItems.forEach(item => {
              const submenu = item.querySelector('ul');
              if (submenu) {
                  item.onmouseenter = function () {
                      submenu.classList.add('active');
                      submenu.style.maxHeight = submenu.scrollHeight + 'px';
                  };
                  item.onmouseleave = function () {
                      submenu.classList.remove('active');
                      submenu.style.maxHeight = null;
                  };
              }
          });
        }
        if (submenuElements && submenuElements.length) {
          submenuElements.forEach(submenu => {
              const isVisible = submenu.style.display === 'block';
              submenu.style.display = 'block';
              const wrapper = submenu.querySelector('.header__submenu-wrapper');
              const items = wrapper.querySelector('.header__submenu-items');
              const itemsHeight = window.innerHeight - items.getBoundingClientRect().top - getStyle(wrapper, 'padding-bottom');
              if (!isVisible)
                  submenu.style.display = 'none';
              items.style.maxHeight = itemsHeight + 'px';
          });
        }

        const mobileMenu = document.querySelector('.mobile-navigation');
        if (mobileMenu) {
            //const mobileButton = document.querySelector('.header__mobile-button');
            //mobileButton.onclick = function () {
            //    manageOverlay('medium');
            //    mobileMenu.classList.add('active');
            //}
            //const mobileCloseButton = document.querySelector('.mobile-navigation__close');
            //mobileCloseButton.onclick = function () {
            //    manageOverlay('none');
            //    mobileMenu.classList.remove('active');
            //}

            const menuItems = mobileMenu.querySelectorAll('li.has-children > a');
            const showmoreButtons = mobileMenu.querySelectorAll('.mobile-navigation__showmore');
            const menuTitle = mobileMenu.querySelector('.mobile-navigation__title');

            menuItems.forEach(item => {
                item.onclick = function (e) {
                    e.preventDefault();
                    const subMenu = item.nextElementSibling;
                    if (subMenu) {
                        mobileMenu.classList.add('in-depth');
                        menuTitle.innerText = item.lastChild.textContent.trim();
                        subMenu.classList.add('active');
                        updateMobileMenu();
                    }
                };
            });
            showmoreButtons.forEach(btn => {
                btn.onclick = function () {
                    const items = btn.closest('.mobile-navigation__items-wrapper');
                    if (items) {
                        const hiddenItems = items.querySelectorAll('.mobile-navigation__item.hidden');
                        hiddenItems.forEach(item => item.classList.remove('hidden'));
                        btn.remove();
                        updateMobileMenu();
                    }
                }
            });
            menuTitle.onclick = function () {
                console.log('clicked');
                const allDepths = mobileMenu.querySelectorAll('.mobile-navigation__items-wrapper.active');
                if (allDepths.length) {
                    const currentMenu = allDepths[allDepths.length - 1];
                    currentMenu.classList.remove('active');
                    const previousTitleElement = currentMenu.parentElement.closest('.mobile-navigation__items-wrapper').previousElementSibling;
                    if (previousTitleElement)
                        menuTitle.innerText = previousTitleElement.lastChild.textContent.trim();
                    else
                        mobileMenu.classList.remove('in-depth');
                    updateMobileMenu();
                }
            }
        };

        function updateMobileMenu() {
            const allDepths = mobileMenu.querySelectorAll('.mobile-navigation__items-wrapper.active');
            const currentMenu = allDepths[allDepths.length - 1];
            currentMenu.style.height = 'auto';
            const currentMenuHeight = currentMenu.getBoundingClientRect().height;
            allDepths.forEach(depth => depth.style.height = currentMenuHeight + 'px');
        }
    }
}

function dropdownInit() {
  const dropdownTriggers = Array.from(document.querySelectorAll("[data-dropdown]"));
  dropdownTriggers.forEach((trigger) => {
    const isDropdownOpened = trigger.classList.contains("is-opened");
    const id = trigger.dataset.dropdown;
    const targets = Array.from(document.querySelectorAll(`[data-dropdown-body=${id}]`));
    targets.forEach((target) => {
      if (isDropdownOpened) {
        target.classList.add("is-opened");
        gsap.set(target, {
          overflow: 'visible',
          height: 'auto'
        });
      }
      if (!isDropdownOpened) {
        target.classList.remove("is-opened");
        gsap.set(target, {
          overflow: 'hidden',
          height: 0
        });
      }
    });
  });
}

function dropdownToggle(trigger) {
  const id = trigger.dataset.dropdown;
  const targets = Array.from(document.querySelectorAll(`[data-dropdown-body=${id}]`));
  const isDropdownOpened = trigger.classList.contains("is-opened");
  if (id && targets.length > 0) {
    let isAnimated = false;
    if (isDropdownOpened) {
      trigger.classList.remove("is-opened");
    } 
    if (!isDropdownOpened) {
      trigger.classList.add("is-opened");
    }
    targets.forEach((target) => {
      if (!target.classList.contains("is-animated") && isDropdownOpened) {
        target.classList.remove("is-opened");
        target.classList.add("is-animated");
        gsap.set(target, {
          overflow: 'hidden'
        });
        gsap.to(target, {
          height: 0,
          onComplete: () => {
            target.classList.remove("is-animated");
          }
        });
      } else if (!target.classList.contains("is-animated") && !isDropdownOpened) {
        target.classList.add("is-opened");
        target.classList.add("is-animated");
        gsap.to(target, {
          height: 'auto',
          onComplete: () => {
            gsap.set(target, {
              overflow: 'visible'
            })
            target.classList.remove("is-animated");
          }
        })
      } else {
        if (isDropdownOpened) {
          trigger.classList.add("is-opened");
        }
        if (!isDropdownOpened) {
          trigger.classList.remove("is-opened");
        }
      }
    });
  }
}

function bannersInit() {
    initSwipers('.banners__items--desktop', {
        effect: 'coverflow',
        slidesPerView: 1.25,
        spaceBetween: 30,
        speed: 800,
        centeredSlides: true,
        loop: true,
        slideToClickedSlide: true,
        coverflowEffect: {
            rotate: 0,
            modifier: 1,
            scale: .92,
            slideShadows: false
        }
    });
    initSwipers('.banners__items--mobile', {
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,
        autoplay: {
            delay: 4000
        }
    });
}

function popularInit() {
    initSwipers('.popular__items', {
        loop: true,
        spaceBetween: 30
    });
    initSwipers('.popular__items--mobile', {
        spaceBetween: 20,
        slidesPerView: 1.2,
        breakpoints: {
          440: {
            spaceBetween: 30,
            slidesPerView: 2
          },
          768: {
            spaceBetween: 30,
            slidesPerView: 3
          }
        }
    });
}

function noveltiesInit() {
    const noveltiesItems = document.querySelectorAll('.novelties__item');
    noveltiesItems.forEach(item => {
        const itemHeight = item.getBoundingClientRect().height;
        const itemDetails = item.querySelector('.novelties__item-details');
        if (itemDetails)
            itemDetails.style.paddingTop = itemHeight + 'px';
    });

    initSwipers('.novelties__slider-items', {
        loop: true,
        spaceBetween: 0,
        slidesPerView: 3,
        breakpoints: {
            320: {
                slidesPerView: 1
            },
            575: {
                slidesPerView: 2
            }
        }
    });
}

function newsInit() {
    initSwipers('.news__items', {
        loop: true,
        spaceBetween: 31,
        slidesPerView: 3,
        breakpoints: {
            320: {
                spaceBetween: 20,
                slidesPerView: 1.5
            },
            575: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            767: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            //991: {
            //    slidesPerView: 4,
            //},
            1199: {
                spaceBetween: 30,
                slidesPerView: 3,
            },
            2000: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            2400: {
                slidesPerView: 5,
                spaceBetween: 30,
            },
        }
    });
}

function reviewsInit() {
    initSwipers('.reviews__items', {
        spaceBetween: 0,
        slidesPerView: 3,
        breakpoints: {
            320: {
                spaceBetween: 20,
                slidesPerView: 1
            },
            767: {
                spaceBetween: 0,
                slidesPerView: 3,
            },
            1199: {
              spaceBetween: 0,
              slidesPerView: 3,
            },
            2000: {
              slidesPerView: 4,
              spaceBetween: 0,
            },
            2400: {
              slidesPerView: 5,
              spaceBetween: 0,
            },
        }
    });
    const reviewsContents = document.querySelectorAll('.reviews__item-content');
    const reviewsLimit = 40;
    reviewsContents.forEach(content => {
        let mainWords = content.innerText.split(' ');
        if (mainWords.length > reviewsLimit) {
            const hiddenWords = mainWords.slice(reviewsLimit).join(' ');
            mainWords = mainWords.slice(0, reviewsLimit).join(' ');
            content.innerText = mainWords;
            content.insertAdjacentHTML('afterend', '<span class="reviews__item-expand">...</span><span class="reviews__item-hidden"> '+hiddenWords+'</span>');
        }
    });
    const reviewsItemExpands = document.querySelectorAll('.reviews__item-expand');
    reviewsItemExpands.forEach(el => {
        el.addEventListener('click', function() {
            const item = this.closest('.reviews__item');
            const hiddenText = item.querySelector('.reviews__item-hidden');
            this.remove();
            hiddenText.style.display = 'inline';
        });
    });
}

function benefitsInit() {
    initSwipers('.benefits__slider', {
        loop: false,
        spaceBetween: 40,
        slidesPerView: 'auto',
    });
}

function mapInitEvent(e) {
    mapInit();
    e.currentTarget.removeEventListener(e.type, mapInitEvent);
}

function mapInit() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        if (window.yandexMapDidInit)
            return false;
        window.yandexMapDidInit = true;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;

        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=9b616601-7607-4022-9e0e-8ec1fead96a0&lang=ru_RU&onload=showMap';

        mapContainer.after(script);
    }
}

function showMap() {
    const zoom = 12;
    const map = window.map = new ymaps.Map('map', {
        center: [53.9, 27.56667],
        zoom: zoom,
        controls: [],
        balloonContentLayout: ymaps.templateLayoutFactory.createClass(
          '<h3>{{ properties.name }}</h3>' +
          '<p>Описание: {{ properties.description }}</p>' +
          '<p>Население: {{ properties.population|default:"неизвестно" }}</p>' +
          '<p>Метрополитен: {% if properties.metro %}да{% else %}нет{% endif %}</p>'
        )
    }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true
        });
        const markerLayout = ymaps.templateLayoutFactory.createClass('<svg width="42" height="64" viewBox="0 0 42 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5255 63.4737C27.9466 63.4737 33.9466 62.5263 33.9466 61.421C33.9466 60.3158 27.9466 59.3684 20.5255 59.3684C13.1045 59.3684 7.10449 60.3158 7.10449 61.421C7.10449 62.5263 13.1045 63.4737 20.5255 63.4737Z" fill="#383938" fill-opacity="0.301961"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.6842 30.9474C40.7368 27.7895 42 24 42 20.0526C42 9 32.6842 0 21 0C9.47368 0 0 9 0 20.0526C0 24 1.26316 27.7895 3.31579 30.9474L19.1053 59.6842C19.8947 61.1053 22.1053 61.1053 22.8947 59.6842L38.6842 30.9474Z" fill="#FFA400"/><path d="M30.6308 14.3684C29.3676 12.1579 27.315 10.579 24.6308 10.2632H24.4729H23.2097C20.9992 10.4211 19.1044 11.5263 17.8413 13.1053L17.6834 13.2632L16.8939 14.3684L16.2623 15.1579L14.5255 17.2106V10.2632H10.5781V26.0527H14.5255V23.2106L15.4729 21.9474L16.2623 21L16.4202 20.6842C16.5781 21.1579 16.736 21.4737 16.8939 21.9474C17.3676 22.8948 18.1571 23.6842 18.9465 24.4737C18.4729 23.6842 18.1571 22.8948 17.8413 21.9474C17.8413 21.7895 17.6834 21.4737 17.6834 21.1579C17.5255 20.2106 17.6834 19.2632 17.9992 18.3158C17.9992 18.1579 17.9992 18.1579 18.1571 18C18.6308 16.7369 19.5781 15.6316 20.6834 15C21.315 14.6842 21.9465 14.3684 22.736 14.2106C22.8939 14.2106 22.8939 14.2106 23.0518 14.2106C23.2097 14.2106 23.3676 14.2106 23.3676 14.2106H23.5255C23.6834 14.2106 23.6834 14.2106 23.8413 14.2106C23.9992 14.2106 23.9992 14.2106 24.1571 14.2106C25.4202 14.3684 26.3676 15.3158 26.8413 16.2632C26.9992 16.7369 27.1571 17.2106 27.1571 17.8421C27.1571 19.8948 25.4202 21.6316 23.3676 21.6316C21.315 21.6316 19.736 19.8948 19.5781 17.8421C19.5781 17.2106 19.736 16.7369 19.8939 16.1053C19.736 16.2632 19.5781 16.4211 19.4202 16.7369C19.1044 17.0527 18.9465 17.5263 18.7887 17.8421C18.315 18.7895 18.1571 19.7369 18.315 20.8421C18.315 21.1579 18.315 21.3158 18.4729 21.6316C18.7887 22.7369 19.2623 23.6842 20.0518 24.4737C20.3676 24.7895 20.8413 25.1053 21.315 25.4211C21.9465 25.579 22.736 25.7369 23.5255 25.7369C24.315 25.7369 25.1044 25.579 25.8939 25.4211C26.8413 25.1053 27.6308 24.7895 28.2623 24.1579C29.0518 23.5263 29.8413 22.7369 30.315 21.7895C30.9465 20.6842 31.2623 19.4211 31.2623 18C31.2623 16.579 30.9465 15.3158 30.315 14.2106L30.6308 14.3684Z" fill="#3D3935"/></svg>');
        const markerHoverLayout = ymaps.templateLayoutFactory.createClass('<svg width="42" height="64" viewBox="0 0 42 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5255 63.4737C27.9466 63.4737 33.9466 62.5263 33.9466 61.421C33.9466 60.3158 27.9466 59.3684 20.5255 59.3684C13.1045 59.3684 7.10449 60.3158 7.10449 61.421C7.10449 62.5263 13.1045 63.4737 20.5255 63.4737Z" fill="#383938" fill-opacity="0.301961"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.6842 30.9474C40.7368 27.7895 42 24 42 20.0526C42 9 32.6842 0 21 0C9.47368 0 0 9 0 20.0526C0 24 1.26316 27.7895 3.31579 30.9474L19.1053 59.6842C19.8947 61.1053 22.1053 61.1053 22.8947 59.6842L38.6842 30.9474Z" fill="#FFA400"/><path d="M30.6308 14.3684C29.3676 12.1579 27.315 10.579 24.6308 10.2632H24.4729H23.2097C20.9992 10.4211 19.1044 11.5263 17.8413 13.1053L17.6834 13.2632L16.8939 14.3684L16.2623 15.1579L14.5255 17.2106V10.2632H10.5781V26.0527H14.5255V23.2106L15.4729 21.9474L16.2623 21L16.4202 20.6842C16.5781 21.1579 16.736 21.4737 16.8939 21.9474C17.3676 22.8948 18.1571 23.6842 18.9465 24.4737C18.4729 23.6842 18.1571 22.8948 17.8413 21.9474C17.8413 21.7895 17.6834 21.4737 17.6834 21.1579C17.5255 20.2106 17.6834 19.2632 17.9992 18.3158C17.9992 18.1579 17.9992 18.1579 18.1571 18C18.6308 16.7369 19.5781 15.6316 20.6834 15C21.315 14.6842 21.9465 14.3684 22.736 14.2106C22.8939 14.2106 22.8939 14.2106 23.0518 14.2106C23.2097 14.2106 23.3676 14.2106 23.3676 14.2106H23.5255C23.6834 14.2106 23.6834 14.2106 23.8413 14.2106C23.9992 14.2106 23.9992 14.2106 24.1571 14.2106C25.4202 14.3684 26.3676 15.3158 26.8413 16.2632C26.9992 16.7369 27.1571 17.2106 27.1571 17.8421C27.1571 19.8948 25.4202 21.6316 23.3676 21.6316C21.315 21.6316 19.736 19.8948 19.5781 17.8421C19.5781 17.2106 19.736 16.7369 19.8939 16.1053C19.736 16.2632 19.5781 16.4211 19.4202 16.7369C19.1044 17.0527 18.9465 17.5263 18.7887 17.8421C18.315 18.7895 18.1571 19.7369 18.315 20.8421C18.315 21.1579 18.315 21.3158 18.4729 21.6316C18.7887 22.7369 19.2623 23.6842 20.0518 24.4737C20.3676 24.7895 20.8413 25.1053 21.315 25.4211C21.9465 25.579 22.736 25.7369 23.5255 25.7369C24.315 25.7369 25.1044 25.579 25.8939 25.4211C26.8413 25.1053 27.6308 24.7895 28.2623 24.1579C29.0518 23.5263 29.8413 22.7369 30.315 21.7895C30.9465 20.6842 31.2623 19.4211 31.2623 18C31.2623 16.579 30.9465 15.3158 30.315 14.2106L30.6308 14.3684Z" fill="#3D3935"/></svg>');
        const clusterLayout = ymaps.templateLayoutFactory.createClass('<div class="cluster_custom"><span>$[properties.geoObjects.length]</span>'
        + '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<circle cx="24" cy="24" r="23" fill="white" stroke="#FFA400" stroke-width="2"/>'
        + '</svg>'
        + '</div>');
    objectManager.objects.options.set({
        iconLayout: markerLayout,
        iconPane: 'overlaps'
    });
    objectManager.clusters.options.set({
        clusterIconLayout: clusterLayout,
        iconPane: 'overlaps'
    });
    map.geoObjects.add(objectManager);
    let points = [
        {
            "type": "Feature",
            "id": 0,
            "geometry": { "type": "Point", "coordinates": [53.911100, 27.415414] },
            "properties": {
                "name": "ГИПЕРМАРКЕТ дверей «Юркас» в ТЦ «Prostore»: ул. Каменногорская, 3 (салон более 500 кв.м)",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
        {
            "type": "Feature",
            "id": 1,
            "geometry": { "type": "Point", "coordinates": [53.914522, 27.537779] },
            "properties": {
                "name": "ул. Аэродромная, 18",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
        {
            "type": "Feature",
            "id": 2,
            "geometry": { "type": "Point", "coordinates": [53.925929, 27.592570] },
            "properties": {
                "name": "Строительный рынок «Уручье», ул. Уручская, 19, пав. 201",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
        {
            "type": "Feature",
            "id": 3,
            "geometry": { "type": "Point", "coordinates": [53.885659, 27.586211] },
            "properties": {
                "name": "ГИПЕРМАРКЕТ дверей «Юркас»",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
        {
            "type": "Feature",
            "id": 4,
            "geometry": { "type": "Point", "coordinates": [53.868448, 27.493995] },
            "properties": {
                "name": "ГИПЕРМАРКЕТ дверей «Юркас» в ТЦ «Prostore»: ул. Каменногорская, 3 (салон более 500 кв.м)",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
        {
            "type": "Feature",
            "id": 5,
            "geometry": { "type": "Point", "coordinates": [53.901001, 27.543650] },
            "properties": {
                "name": "ул. Аэродромная, 182",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
        {
            "type": "Feature",
            "id": 6,
            "geometry": { "type": "Point", "coordinates": [53.901704, 27.547609] },
            "properties": {
                "name": "Строительный рынок",
                "description": '<span>+375 (44) 711-23-66</span><span>пн-сб: 10:00 - 20:00 </span><span>вс: 10:00 - 18:00</span><span>ЧТУП "Дверной Лидер" УНП 691543753</span>',
                //"balloonContentBody": '<div class="map_info_store">'
                //    + '<div class="title"><p class="dark_link">Минск</p></div><div class="properties"><div class="property phone"><div class="muted">Телефон</div><div class="value">'
                //    + '<a class="dark_link" rel="nofollow" href="tel:+375999999999">+375 99 999-99-99</a></div></div><div class="phone"><br><div class="muted">Время работы</div>'
                //    + '<div class="value"><p class="dark_link1">Пн-Пт: 09:00-20:00<br>Сб: 10:00-18:00<br>Вс: 10:00-18:00</p></div></div></div></div>',
            },
            "options": {
              "openEmptyBalloon": true,
              "hideIconOnBalloonOpen": false
            }
        },
    ];
    const dataPoints = map.container._parentElement.getAttribute('data-points');
    if (dataPoints)
        points = JSON.parse(dataPoints);
        objectManager.add({
          "type": "FeatureCollection",
          "features": points
        });
    
    objectManager.objects.options.set({
      balloonContentLayout: ymaps.templateLayoutFactory.createClass(
        '<div class="card card--office">' +
        '<h3 class="card__title">{{ properties.name }}</h3>' +
        '{{ properties.balloonContentBody|raw }}' +
        '</div>'
        )
      //balloonContentLayout: ymaps.templateLayoutFactory.createClass(
      //  '<h3>{{ properties.name }}</h3>' +
      //  '{{ properties.balloonContentBody|raw }}'
      //  )
      });
      //'<p>Описание: {{ properties.description|raw }}</p>' +
      //'<p>Население: {{ properties.population|default:"неизвестно" }}</p>' +
      //'<p>Метрополитен: {% if properties.metro %}да{% else %}нет{% endif %}</p>'
    const activePoint = map.container._parentElement.getAttribute('data-active-office');
    let activePointObj;
    if (activePoint)
        activePointObj = points.find((obj) => obj["id"] == activePoint);
    console.log("activePointObj")
    console.log(activePointObj)

    const openPoint = map.container._parentElement.getAttribute('data-point-open');
    //console.log(openPoint)
    if (openPoint) {
    //if (openPoint && dataPoints) {
      const coor = objectManager.objects.getById(openPoint).geometry.coordinates;
      goToPlace(coor, 18);
      objectManager.objects.balloon.open(openPoint)
    }

    function goToPlace(q, z = zoom, idBalloon) {
        ymaps.geocode(q).then(
            function (r) {
                const coords = (Array.isArray(q)) ? q : r.geoObjects.get(0).geometry.getCoordinates();
                //map.setCenter(coords);
                //map.setZoom(z, { smooth: true })
                map.panTo([coords]).then(function() {
                  if (idBalloon) {
                    objectManager.objects.balloon.open(idBalloon);
                  }
                })
            }
        );
    }
    const find = function (arr, query) {
        return arr.filter(function (obj) {
            if (obj.properties.name)
                return (obj.properties.name).toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };
    const dataZoom = map.container._parentElement.getAttribute('data-zoom');
    const dataCenter = map.container._parentElement.getAttribute('data-center');
    if (dataCenter) {
        let placeZoom = zoom
        if (dataZoom) {
            placeZoom = dataZoom
        }
        goToPlace(JSON.parse(dataCenter), placeZoom);
    }
    const dataCity = map.container._parentElement.getAttribute('data-city');
    if (dataCity) {
        let placeZoom = zoom
        if (dataZoom) {
            placeZoom = dataZoom
        }
        goToPlace(dataCity, placeZoom);
    }
    
    const goToBusLink = document.querySelector('.go-to-bus')
    if (goToBusLink) {
        const stopCoords = [53.849275, 27.473227]
        goToBusLink.addEventListener('click', function () {
            goToPlace(stopCoords, 18);
        })
    }
    const customProvider = {
        suggest: function (query, options) {
            var r = find(points, query),
                arrayResult = [];
            const res = r.filter(el => {
                //if (el.properties.location)
                //    return citySelect.value.trim() === el.properties.location.trim();
                //else
                    return true;
            });
            const results = Math.min(options.results, res.length);
            for (var i = 0; i < results; i++) {
                arrayResult.push({ id: res[i].id, name: res[i].properties.name, description: res[i].properties.description, value: res[i].geometry.coordinates })
            }
            return ymaps.vow.resolve(arrayResult);
        }
    }
    const customResults = ymaps.templateLayoutFactory.createClass(
        '<div class="mapresults {% if state.items.length == 0 %}empty{% endif %}"><ul class="mapresults__inner">{% for item in state.items %}<li class="mapresults__item" data-id="{{ item.id }}" data-value="{{ item.value }}"><span class="mapresults__item-name">{{ item.name }}</span>{{ item.description | raw }}</li>{% endfor %}</ul></div>'
    );
    map.geoObjects.events
        .add('balloonopen', function (e) {
          const targetId = e.get("objectId");
          objectManager.objects.setObjectOptions(targetId, {
            iconLayout: markerHoverLayout
          });
        })
        .add('balloonclose', function (e) {
          const targetId = e.get("objectId");
          objectManager.objects.setObjectOptions(targetId, {
            iconLayout: markerLayout
          });
        });
    document.addEventListener('click', function (e) {
        const resultItem = e.target.closest('.mapresults__item');
        if (resultItem) {
            const value = resultItem.getAttribute('data-value');
            const id = resultItem.getAttribute('data-id');
            goToPlace(value, 18, id);
            e.target.closest('.mapresults').classList.add('empty');
            if (document.querySelector("#mapSearch")) {
              document.querySelector("#mapSearch").value = "";
            }
        }
    });

    const searchInput = document.getElementById('mapSearch');
    const suggestSearch = new ymaps.SuggestView(searchInput, {
        offset: [0, 4],
        provider: customProvider,
        layout: customResults
    });


    const citySelect = document.querySelector('select.offices__city');
    if (citySelect.classList.contains('city-link__control')) {
        if (citySelect) {
            citySelect.addEventListener('change', function (event) {
                window.location.href = event.target.options[event.target.selectedIndex].dataset.link
            })
        }
    } else {
        if (citySelect) {
            citySelect.addEventListener('change', function () {
                const city = citySelect.value;
                if (city) {
                    goToPlace(city);
                }
            });
        }
    }
}

function catalogInit() {
    const filterBar = document.querySelector('.catalog__filters');
    if (filterBar) {
        const filterHiddenLinks = filterBar.querySelectorAll('.catalog__filter-hidden');
        filterHiddenLinks.forEach(link => {
            link.addEventListener('click', function () {
                const filter = this.closest('.catalog__filter');
                const hiddenItems = filter.querySelectorAll('.hidden');
                hiddenItems.forEach(item => item.classList.remove('hidden'));
                this.remove();
            });
        });

        const filterButton = document.querySelector('.catalog__filter-button');
        filterButton.addEventListener('click', function () {
            manageOverlay('medium');
            filterBar.classList.add('active');
        });

        const closeFilterButton = filterBar.querySelector('.catalog__filters-close');
        closeFilterButton.addEventListener('click', function () {
            manageOverlay('none');
            filterBar.classList.remove('active');
        });

        const filtersContainer = filterBar.querySelector('.catalog__filters-container');
        const filtersHeader = filterBar.querySelector('.catalog__filters-header');
        const filtersFooter = filterBar.querySelector('.catalog__filters-footer');
        filtersContainer.addEventListener('scroll', function () {
            filtersHeader.classList.add('active');
            filtersFooter.classList.add('active');
        });
    }
}

function productInit() {
    const productValues = document.querySelectorAll('.product__option-value');
    productValues.forEach(value => {
        value.addEventListener('click', function () {
            if (!value.classList.contains('active') && !value.classList.contains('disabled')) {
                const allValues = value.closest('.product__option-values').querySelectorAll('.product__option-value');
                allValues.forEach(v => v.classList.remove('active'));
                value.classList.add('active');
            }
        });

    });

    initSwipers('.product__suitables-items', {
        loop: true,
        spaceBetween: 0,
        slidesPerView: 6,
        breakpoints: {
            320: {
                slidesPerView: 2.1
            },
            767: {
                slidesPerView: 2
            },
            991: {
                slidesPerView: 3
            },
            1199: {
                slidesPerView: 4
            },
            1399: {
                slidesPerView: 5
            },
            2000: {
                slidesPerView: 7
            },
            2399: {
                slidesPerView: 8
            }
        }
    });
    initSwipers('.product-interior__slider', {
        loop: true,
        spaceBetween: 0,
        slidesPerView: 1,
    });
    initSwipers('.metering__swiper', {
      slidesPerView: "auto",
      spaceBetween: 20,
      //slideToClickedSlide: true,
      direction: "horizontal",
      breakpoints: {
        768: {
          direction: "vertical",
          slidesPerView: 4,
          spaceBetween: 20
        },
      }
    });

    initSwipers('.product__related-slider', {
        spaceBetween: 0,
        slidesPerView: 2
    });

    initSwipers('.product__watched-slider', {
        spaceBetween: 0,
        slidesPerView: 5,
        breakpoints: {
            320: {
                slidesPerView: 2.25
            },
            767: {
                slidesPerView: 3
            },
            991: {
                slidesPerView: 5
            },
        }
    });
}

function warrantyInit() {
    const warrantySection = document.querySelector('.warranty__wrapper');
    if (warrantySection) {
        const warrantyDetails = warrantySection.querySelector('.warranty__details');
        const warrantySteps = warrantySection.querySelector('.warranty__steps');
        const warrantyStepCaptionsWrapper = warrantySection.querySelector('.warranty__steps-captions');

        const warrantyDetailsButton = warrantyDetails.querySelector('.warranty__details-button');
        warrantyDetailsButton.addEventListener('click', function () {
            warrantyDetails.classList.remove('active');
            warrantySteps.classList.add('active');
        });

        const warrantyStepButtons = warrantySteps.querySelectorAll('.warranty__step-button');
        warrantyStepButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const activeCaption = warrantyStepCaptionsWrapper.querySelector('.warranty__steps-caption.active');
                const activeCaptionIndex = Array.prototype.indexOf.call(warrantyStepCaptionsWrapper.children, activeCaption);
                if (activeCaption)
                    goToStep(activeCaptionIndex + 1);
            });
        });

        const warrantyStepCaptions = warrantyStepCaptionsWrapper.querySelectorAll('.warranty__steps-caption');
        warrantyStepCaptions.forEach((caption, i) => {
            caption.addEventListener('click', function () {
                const activeCaption = warrantyStepCaptionsWrapper.querySelector('.warranty__steps-caption.active');
                const activeCaptionIndex = Array.prototype.indexOf.call(warrantyStepCaptionsWrapper.children, activeCaption);
                if (i < activeCaptionIndex)
                    goToStep(i);
            });
        });

        function goToStep(n = 0) {
            const wrapper = document.querySelector('.warranty__steps');
            const container = wrapper.querySelector('.warranty__steps-wrapper');
            const captions = wrapper.querySelectorAll('.warranty__steps-caption');
            const steps = wrapper.querySelectorAll('.warranty__step');
            const activeCaption = wrapper.querySelector('.warranty__steps-caption.active');
            const activeStep = wrapper.querySelector('.warranty__step.active');
            if (steps[n] && captions[n]) {
                window.scrollTo({
                    top: container.getBoundingClientRect().top + window.scrollY - 16,
                    behavior: "smooth"
                });
                [activeCaption, activeStep].forEach(el => el.classList.remove('active'));
                [captions[n], steps[n]].forEach(el => el.classList.add('active'));

                const stepFiles = steps[n].querySelectorAll('.file');
                stepFiles.forEach(file => {
                    const nameLabel = file.querySelector('.file__name');
                    const name = nameLabel.querySelector('.file__name-value');
                    fitFileValue(name, nameLabel);
                });
            }
        }
    }
}

function scheduleInit() {
    const scheduleSection = document.querySelector('.schedule');
    if (scheduleSection) {
        const scheduleButton = scheduleSection.querySelector('.schedule__close');
        if (scheduleButton) {
            scheduleButton.addEventListener('click', function () {
                scheduleSection.classList.add('hidden')
            });
        }
    }
}

function promotionsInit() {
    initSwipers('.promotions__slider', {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 1,
        autoplay: {
            delay: 4000
        }
    });
}

function projectInit() {
    initSwipers('.project__slider .swiper', {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 1,
        on: {
            init: function() {
                if (this.slides.length <= 1) {
                    this.el.classList.add('swiper-no-swiping');
                }
            }
        }
    });
}

function historyInit() {
    const historyWrapper = document.querySelector('.history__items');
    if (historyWrapper) {
        const wrapperTop = historyWrapper.getBoundingClientRect().top + window.scrollY;
        const historyItems = historyWrapper.querySelectorAll('.history__item');
        document.addEventListener('scroll', function (e) {
            const wrapperHeight = historyWrapper.getBoundingClientRect().height;
            const windowHeight = window.innerHeight;
            const scroll = window.scrollY;
            const marker = scroll + windowHeight / 2.5;
            historyItems.forEach((i, n) => {
                const item = i.getBoundingClientRect();
                const position = item.top + scroll;
                const year = i.querySelector('.history__item-year');
                const yearHeight = year.getBoundingClientRect().height;
                const height = item.height - yearHeight;
                if (position <= marker) {
                    i.classList.add('active');
                    let itemOffset = 0;
                    (marker - position > height / 2) ? itemOffset = height / 2 : itemOffset = marker - position;
                    year.style.transform = 'translateY(' + itemOffset + 'px)';
                } else {
                    i.classList.remove('active');
                }
            });
            const fillPercent = (marker - wrapperTop + 25) * 100 / wrapperHeight;
            let lineProgress = 0;
            (fillPercent > 100) ? lineProgress = 100 : (fillPercent < 0) ? lineProgress = 0 : lineProgress = fillPercent;
            historyWrapper.style.setProperty('--line-progress', lineProgress + '%');
        });
    }
}

function reviewsListInit() {
    const reviewsList = document.querySelector('.reviews-list');
    if (reviewsList) {
        const statisticsStars = reviewsList.querySelectorAll('.reviews-list__statistics-stars');
        let statisticsStarsWidth = 0;
        statisticsStars.forEach(e => {
            const width = e.getBoundingClientRect().width;
            if (width > statisticsStarsWidth)
                statisticsStarsWidth = width;
        });
        statisticsStars.forEach(e => e.style.width = statisticsStarsWidth + 'px');

        const statisticsCounts = reviewsList.querySelectorAll('.reviews-list__statistics-count');
        let statisticsCountsWidth = 0;
        statisticsCounts.forEach(e => {
            const width = e.getBoundingClientRect().width;
            if (width > statisticsCountsWidth)
                statisticsCountsWidth = width;
        });
        statisticsCounts.forEach(e => e.style.width = statisticsCountsWidth + 'px');
    }
}

function footerInit() {
    const footer = document.querySelector('.footer');
    if (footer) {
        const hasChildrenItems = footer.querySelectorAll('li.has-children');
        hasChildrenItems.forEach(item => {
            const toggle = item.firstChild;
            toggle.addEventListener('click', function () {
                item.classList.toggle('active');
                const submenu = this.nextElementSibling;
                if (submenu.style.maxHeight)
                    submenu.style.maxHeight = null;
                else
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
            });
        });
    }
}

function closePopup(popup) {
    if (popup) {
        const video = popup.querySelector('iframe');
        if (video) {
            const videoSrc = video.src;
            video.setAttribute('src', videoSrc);
        }
        popup.style.opacity = '0';
        setTimeout(function () {
            popup.classList.remove('active');
            bodyFix(false);
        }, 200);
    }
}

function manageOverlay(overlayLevel = 'none') {
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('overlay--low', 'overlay--medium', 'overlay--high');
    if (overlayLevel === 'none') {
        overlay.classList.remove('overlay--show');
    } else {
        if (!overlay.classList.contains('overlay--show'))
            overlay.classList.add('overlay--show');
        overlay.classList.add('overlay--' + overlayLevel);
    }
}

function getWidth(el) {
    return Math.max(el.getBoundingClientRect().width, el.offsetWidth);
}

function getHeight(el) {
    return Math.max(el.getBoundingClientRect().height, el.offsetHeight);
}

function getStyle(el, rule) {
    let value = '';
    if (el) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            value = document.defaultView.getComputedStyle(el, '').getPropertyValue(rule);
        } else if (el.currentStyle) {
            rule = rule.replace(/\-(\w)/g, function (m, p1) {
                return p1.toUpperCase();
            });
            value = el.currentStyle[rule];
        }
        if (value.includes('px'))
            value = parseFloat(value);
    }
    return value;
}

function initSwipers(selector, swiperOptions = {}) {
    const sliders = document.querySelectorAll(selector);
    sliders.forEach((slider) => {
        let defaultOptions = {};
        const container = slider.closest('[data-container]');
        if (container) {
            const scrollbar = container.querySelector('.swiper-scrollbar');
            defaultOptions = {
                navigation: {
                    nextEl: container.querySelector('.swiper-button-next'),
                    prevEl: container.querySelector('.swiper-button-prev')
                },
                pagination: {
                    el: container.querySelector('.swiper-pagination'),
                    clickable: true
                }
            }
            if (scrollbar) {
                defaultOptions.scrollbar = {
                    el: scrollbar,
                    draggable: true
                }
            }
        }
        const swiper = new Swiper(slider, {
            ...defaultOptions,
            ...swiperOptions
        });
    });
}

function fitFileValue(name, nameLabel) {
    let extraOffset = 0;
    if (nameLabel.getAttribute('data-extension'))
        extraOffset = getTextWidth(name.getAttribute('data-extension'), getCanvasFont(name));
    name.style.maxWidth = '0px';
    name.style.maxWidth = getWidth(nameLabel) - getStyle(nameLabel, 'padding-left') - getStyle(nameLabel, 'padding-right') - extraOffset - 5 + 'px';
}

function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);

    return metrics.width;
}

function getCanvasFont(el = document.body) {
    const fontWeight = getStyle(el, 'font-weight') || 'normal';
    const fontSize = getStyle(el, 'font-size') || '17px';
    const fontFamily = getStyle(el, 'font-family') || 'Lato';

    return `${fontWeight} ${fontSize}px ${fontFamily}`;
}

function updateWidthScrollbar() {
  let div = document.createElement('div');

  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';

  document.body.append(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;

  div.remove();
  document.body.style.setProperty("--scrollbar-width", scrollWidth + "px")
}


function initConstructor() {
  const constructor = document.querySelector('[data-constructor]');
  const constructorOptionalImages = Array.from(document.querySelectorAll('[data-constructor-visible]'));
  function changeVisibleImagesConstructor() {
    constructorOptionalImages.forEach((image) => {
      if (!!constructor.dataset.constructor) {
        if (image.dataset.constructorVisible === constructor.dataset.constructor) {
          image.classList.remove("is-hidden");
        } else {
          image.classList.add("is-hidden");
        }
      }
    });
    if (constructor.dataset.constructor === "exterior") {
      const doors = Array.from(document.querySelectorAll("[data-door-exterior]"));
      doors.forEach((img) => {
        console.log(img)
        img.setAttribute("src", img.dataset.doorExterior);
      })
    } else {
      const doors = Array.from(document.querySelectorAll("[data-door-interior]"));
      doors.forEach((img) => {
        img.setAttribute("src", img.dataset.doorInterior);
      })
    }
  }
  updateConstructorSizes();
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-constructor-background]')) {
      const source = e.target.closest('[data-constructor-background]');
      if (constructor && !constructor.classList.contains("is-constructor")) {
        constructor.classList.add("is-constructor");
        //setTimeout(() => {
        //  updateConstructorSizes();
        //}, 500)
      }
      changeConstructorBackground(source);
      changeVisibleImagesConstructor();
    }
    if (e.target.closest('[data-constructor-door]')) {
      const source = e.target.closest('[data-constructor-door]');
      //console.log(source)
      // Перенос двери из атрибута в src
      const pathToImg = source.dataset.constructorDoor || null;
      const targets = Array.from(document.querySelectorAll("[data-constructor-door-target]"));
      targets.forEach((target) => {
        if (pathToImg && target.hasAttribute("src")) {
          target.setAttribute("data-door-interior", pathToImg);
          if (source.hasAttribute("data-constructor-door-exterior")) {
            target.setAttribute("data-door-exterior", source.dataset.constructorDoorExterior);
          } else if (target.hasAttribute("data-door-exterior")) {
            target.removeAttribute("data-door-exterior");
          }
          target.setAttribute("src", pathToImg);
        }
      });
      if (constructor.classList.contains("is-constructor")) {
        changeVisibleImagesConstructor();
      }
    }
    if (e.target.closest("[data-popup-open]")) {
      if (!constructor.classList.contains("is-constructor") && e.target.closest("[data-popup-open]").dataset.popupOpen === "popup-loupe") return;
      if (!constructor.classList.contains("is-constructor") && e.target.closest("[data-popup-open]").dataset.popupOpen === "popup-order") return;
      if (constructor && !constructor.classList.contains("is-constructor")) {
        constructor.classList.add("is-constructor");
        changeVisibleImagesConstructor();
        const bgSliders = Array.from(document.querySelectorAll(".product-constructor__slider--backgrounds"));
        bgSliders.forEach((slider) => {
          const slide = slider.querySelector(".product-slide");
          if (slide) {
            slide.classList.add("product-slide-active");
            if (slide.hasAttribute("data-constructor-background")) {
              changeConstructorBackground(slide);
            }
          }
        });
      }
      if (constructor) {
        const doorSliderInPopup = document.querySelector(".product-constructor__slider--doors");
        if (!doorSliderInPopup.querySelector(".product-slide-active")) {
          const doorSlide = doorSliderInPopup.querySelector(".product-slide");
          doorSlide.classList.add("product-slide-active");
        }
        
      }
      setTimeout(() => {
        updateConstructorSizes();
      }, 100)
    }
    if (e.target.closest("[data-popup-close]")) {
      const popup = e.target.closest(".popup-default");
      gsap.to(popup, {
        autoAlpha: 0,
        onComplete: () => {
          gsap.set(popup, {
            display: "none",
          })
          bodyFix(false);
          setTimeout(() => {
            updateConstructorSizes();
          }, 25)
        }
      })
    }
  });
  const resizeConstructor = debounce(() => {
    updateConstructorSizes();
  }, 200);
  window.addEventListener("resize", resizeConstructor);
  window.addEventListener("bodyFixed", resizeConstructor);
  window.addEventListener("bodyUnfixed", resizeConstructor);
}

function changeConstructorBackground(source) {
  // Перенос фона из атрибута в src
  const pathToImg = source.dataset.constructorBackground || null;
  const isExterior = source.hasAttribute("data-constructor-is-exterior") ? true : false;
  if (isExterior) {
    document.querySelector("[data-constructor]").dataset.constructor = "exterior";
  } else {
    document.querySelector("[data-constructor]").dataset.constructor = "interior";
  }
  const targets = Array.from(document.querySelectorAll("[data-constructor-background-target]"));
  targets.forEach((target) => {
    if (pathToImg && target.hasAttribute("src")) {
      target.setAttribute("src", pathToImg);
      const varsElem = target.closest("[data-constructor-vars]");
      const attrs = [
        'door-bottom',
        'door-left-center',
        'door-width',
        'door-height',
        'background-width',
        'background-height'
      ];
      attrs.forEach((attr) => {
        if (varsElem && source.hasAttribute(`data-constructor-${attr}`)) {
          varsElem.setAttribute(`data-constructor-${attr}`, source.getAttribute(`data-constructor-${attr}`));
        }
      });
      setTimeout(() => {
        updateConstructorSizes();
      }, 100)
    }
  });
}

function updateConstructorSizes() {
  const targets = Array.from(document.querySelectorAll("[data-constructor-background-target]"));
  targets.forEach((img) => {
    const varsElem = img.closest("[data-constructor-vars]");
    const containerWidth = img.clientWidth;
    const containerHeight = img.clientHeight;
    const naturalWidth = varsElem.getAttribute("data-constructor-background-width") || img.naturalWidth;
    const naturalHeight = varsElem.getAttribute("data-constructor-background-height") || img.naturalHeight;

    const containerRatio = containerWidth / containerHeight;
    const imageRatio = naturalWidth / naturalHeight;

    const displayedWidth = containerWidth;
    const displayedHeight = containerHeight;
    if (varsElem) {
      if (imageRatio > containerRatio) { // шире
        // displayedHeight = containerWidth / imageRatio;
        if (varsElem.hasAttribute("data-constructor-door-bottom")) {
          const inPx = +varsElem.dataset.constructorDoorBottom;
          const inPercent = inPx / (naturalHeight / 100);
          varsElem.style.setProperty('--door-bottom', inPercent + '%')
        }
        if (varsElem.hasAttribute("data-constructor-door-width")) {
          const inPx = +varsElem.dataset.constructorDoorWidth;
          const scaleFactor = displayedHeight / naturalHeight;
          const inPercent = (inPx * scaleFactor) / (displayedWidth / 100);
          varsElem.style.setProperty('--door-width', inPercent + '%')
        }
        if (varsElem.hasAttribute("data-constructor-door-left-center")) {
          const centred = +varsElem.dataset.constructorBackgroundWidth / 2;
          const x = +varsElem.dataset.constructorDoorLeftCenter;
          const inPx = x - centred;
          const scaleFactor = displayedHeight / naturalHeight;
          let inPercent = (inPx * scaleFactor) / (displayedWidth / 100);
          if (inPercent > 35) {
            varsElem.style.setProperty('--background-position', 'bottom right');
            // object-position: bottom right;
            inPercent = ((naturalWidth - x) * scaleFactor) / (displayedWidth / 100);
            varsElem.style.setProperty('--door-right-center', inPercent + '%');
            varsElem.classList.add("is-bg-right");
          } else if (inPercent < -35) {
            varsElem.style.setProperty('--background-position', 'bottom left');
            inPercent = (x * scaleFactor) / (displayedWidth / 100);
            varsElem.style.setProperty('--door-left-center', inPercent - 50 + '%');
            varsElem.classList.remove("is-bg-right");
            // object-position: bottom left;
          } else {
            varsElem.style.setProperty('--background-position', 'bottom center');
            varsElem.style.setProperty('--door-left-center', inPercent  + '%');
            varsElem.classList.remove("is-bg-right");
            
          }
        }
      } else { // выше
        // displayedWidth = containerHeight * imageRatio;
        if (varsElem.hasAttribute("data-constructor-door-bottom")) {
          const inPx = +varsElem.dataset.constructorDoorBottom;
          const scaleFactor = displayedWidth / naturalWidth;
          const inPercent = (inPx * scaleFactor) / (displayedHeight  / 100);
          varsElem.style.setProperty('--door-bottom', inPercent + '%')
        }
        if (varsElem.hasAttribute("data-constructor-door-width")) {
          const inPx = +varsElem.dataset.constructorDoorWidth;
          const scaleFactor = displayedWidth / naturalWidth;
          const inPercent = (inPx * scaleFactor) / (displayedWidth  / 100);
          varsElem.style.setProperty('--door-width', inPercent + '%')
        }
        if (varsElem.hasAttribute("data-constructor-door-left-center")) {
          const centred = +varsElem.dataset.constructorBackgroundWidth / 2;
          const x = +varsElem.dataset.constructorDoorLeftCenter;
          const inPx = x - centred;
          const scaleFactor = displayedWidth / naturalWidth;
          const inPercent = (inPx * scaleFactor) / (displayedWidth  / 100);
          varsElem.style.setProperty('--door-left-center', inPercent + '%');
          if (inPercent > 35) {
            varsElem.style.setProperty('--background-position', 'bottom right');
            // object-position: bottom right;
            varsElem.style.setProperty('--door-left-center', inPercent + '%');
          } else if (inPercent < -35) {
            varsElem.style.setProperty('--background-position', 'bottom left');
            varsElem.style.setProperty('--door-left-center', inPercent + '%');
            // object-position: bottom left;
          } else {
            varsElem.style.setProperty('--background-position', 'bottom center');
            varsElem.style.setProperty('--door-left-center', inPercent + '%');

          }
        }
      }
    }
  });
}


// Debouncer
function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

function initCardsSliders() {
  const cardsProduct = Array.from(document.querySelectorAll(".card--product"));
  cardsProduct.forEach((card) => {
    if (!card.classList.contains("is-slider-initialized")) {
      const sliderElemMain = card.querySelector(".card-main .swiper");
      const sliderElemPreview = card.querySelector(".card-previews .swiper");
      const previewSlides = sliderElemPreview.querySelectorAll(".swiper-slide");
      const sliderPreview = new Swiper(sliderElemPreview, {
        slidesPerView: 3,
        centeredSlides: previewSlides.length > 2 ? false : true,
        spaceBetween: 12,
        slideToClickedSlide: true,
        navigation: {
          nextEl: card.querySelector(".card-previews .swiper-button-next"),
          prevEl: card.querySelector(".card-previews .swiper-button-prev")
        },
      })
      const sliderMain = new Swiper(sliderElemMain, {
        slidesPerView: 1,
        spaceBetween: 20,
        allowTouchMove: false,
        thumbs: {
          swiper: sliderElemPreview
        },
      });
      card.classList.add("is-slider-initialized");
    }
  })
  const cardsDual = Array.from(document.querySelectorAll(".card--dual"));
  cardsDual.forEach((card) => {
    if (!card.classList.contains("is-slider-initialized")) { 
      const sliderElemMain = card.querySelector(".card-main .swiper");
      const sliderElemPreview = card.querySelector(".card-previews .swiper");
      const sliderPreview = new Swiper(sliderElemPreview, {
        slidesPerView: 3,
        spaceBetween: 25,
        slideToClickedSlide: true,
        navigation: {
          nextEl: card.querySelector(".card-previews .swiper-button-next"),
          prevEl: card.querySelector(".card-previews .swiper-button-prev")
        },
        breakpoints: {
          992: {
            direction: "vertical",
            spaceBetween: 4
          },
          1200: {
            direction: "vertical",
            spaceBetween: 16
          }
        }
      })
      const sliderMain = new Swiper(sliderElemMain, {
        slidesPerView: 1,
        allowTouchMove: false,
        thumbs: {
          swiper: sliderElemPreview
        },
      });
      card.classList.add("is-slider-initialized");
    }
  })
  const cardsMono = Array.from(document.querySelectorAll(".card--mono"));
  cardsMono.forEach((card) => {
    if (!card.classList.contains("is-slider-initialized")) { 
      const sliderElemMain = card.querySelector(".card-main .swiper");
      const sliderElemPreview = card.querySelector(".card-previews .swiper");
      const sliderPreview = new Swiper(sliderElemPreview, {
        slidesPerView: 5,
        spaceBetween: 8,
        slideToClickedSlide: true,
        navigation: {
          nextEl: card.querySelector(".card-previews .swiper-button-next"),
          prevEl: card.querySelector(".card-previews .swiper-button-prev")
        },
        breakpoints: {
          992: {
            direction: "vertical",
            spaceBetween: 4,
            slidesPerView: 3
          },
          1200: {
            direction: "vertical",
            slidesPerView: 3,
            spaceBetween: 16
          }
        }
      })
      const sliderMain = new Swiper(sliderElemMain, {
        slidesPerView: 1,
        allowTouchMove: false,
        thumbs: {
          swiper: sliderElemPreview
        },
      });
      card.classList.add("is-slider-initialized");
    }
  })
  const cardsMonoSmall = Array.from(document.querySelectorAll(".card--monosmall"));
  cardsMonoSmall.forEach((card) => {
    if (!card.classList.contains("is-slider-initialized")) {
      const sliderElemMain = card.querySelector(".card-main .swiper");
      const sliderElemPreview = card.querySelector(".card-previews .swiper");
      const sliderPreview = new Swiper(sliderElemPreview, {
        slidesPerView: 3,
        spaceBetween: 4,
        slideToClickedSlide: true,
        navigation: {
          nextEl: card.querySelector(".card-previews .swiper-button-next"),
          prevEl: card.querySelector(".card-previews .swiper-button-prev")
        },
        breakpoints: {
          992: {
            direction: "vertical",
            spaceBetween: 4,
            slidesPerView: 3
          },
          1200: {
            direction: "vertical",
            slidesPerView: 3,
            spaceBetween: 12
          }
        }
      })
      const sliderMain = new Swiper(sliderElemMain, {
        slidesPerView: 1,
        allowTouchMove: false,
        thumbs: {
          swiper: sliderElemPreview
        },
      });
      card.classList.add("is-slider-initialized");
    }
  })
  const cardsOfficeSlider = Array.from(document.querySelectorAll(".card--office .card-slider"));
  cardsOfficeSlider.forEach((card) => {
    if (!card.classList.contains("is-slider-initialized")) {
      const sliderElemMain = card.querySelector(".swiper");
      const sliderMain = new Swiper(sliderElemMain, {
        slidesPerView: 1.18,
        spaceBetween: 14,
        slideToClickedSlide: true,
        navigation: {
          nextEl: card.querySelector(".swiper-button-next"),
          prevEl: card.querySelector(".swiper-button-prev")
        },
      });
      card.classList.add("is-slider-initialized");
    }
  });
  // lazyLoadInstance.update();
}