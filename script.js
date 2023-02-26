'use strict';

///////////////////////////////////////
// APPLICATION
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
// Modal Component
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Tabbed Component
const operationTabs = document.querySelectorAll('.operations__tab');
const operationTabsContainer = document.querySelector(
  '.operations__tab-container'
);
const operationContent = document.querySelectorAll('.operations__content');

// APPLICATION

// Opening the modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
// Closing the modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//TODO:
// using forEach as this is a nodeList not really an array instead of the for loop
// iterating over each element that when clicked is supposed to show the popup

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// The X that we see when opening the modal
btnCloseModal.addEventListener('click', closeModal);
// when clicking outside the modal also closes the modal
overlay.addEventListener('click', closeModal);
// closing the modal if the user presses escape key
document.addEventListener('keydown', function (e) {
  // if escape key is pressed and modal does not contain the class of hidden only then close the modal
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const smoothScrollToSection = sectionID => {
  window.scrollTo({
    // here we are adding to the section what was subtracted when we scrolled down from the window.pageYoffset
    // setting optional Chaining so incase the id received is not valid or not stored anywhre it will just return undefined
    left: sectionID?.getBoundingClientRect().left + window.pageXOffset,
    top: sectionID?.getBoundingClientRect().top + window.pageYOffset,
    behavior: 'smooth',
  });
};

btnScrollTo.addEventListener('click', e => {
  e.preventDefault();
  // ******getBoundingClientRect() EXPLAINED!*****

  // when calling this function on the section1 it shows an object that contains different values regarding the position of the section 1 the main ones we want to pay attention to is the y and x axis when we first land on the page it shows us the distance from the top of the page until the section in ex: 750px as we scroll down by 100 px lets say the y value then becomes the 750 - 100 so 650;

  // 1.THE Y VALUE CALCULATES THE DISTANCE OF THE CURRENT VIEWPORT UNTIL THE FIRST SECTION

  // console.log(e.target.getBoundingClientRect()); // here we use the target method to take the target the element we are assging the event listner to in this case the btnScroll to

  // console.log(section1.getBoundingClientRect());

  // 2. window.pageXOffset & window.pageYOffset
  // this kind of works the opposite to the function above as when the page first loads both values are set to zero depending on which axis we are scrolling the values will increase by how much we scrolled from the original point in this scenario we are scrolling down therefore the y axis so when the number in incrementing when we scroll down the value of the Y axis in the rect function is decreasing by that number as we are getting close to that section
  // THE Y VALUE WHEN THE PAGE LOADED IS AT ZERO BY THE AMOUNT OF PIXELS WE SCROLLED FROM THE ORIGINAL POINT IT WILL INCREASE THE Y VALUE BY IT

  smoothScrollToSection(section1);
});

// EVENT DELAGATION:

// 1. add the event listener to the parent element we want the children to use
// 2. Determine what element originated that event

// TODO: NAVIGATION PAGE SCROLLING

// Selecting the parent element which we want to enalbe any clicks within it
document.querySelector('.nav').addEventListener('click', function (e) {
  // preventing Default Behavior
  e.preventDefault();
  // here we are making sure that the click event happened on a naviagtion item that has the class of nav__link so we are sure it has an href
  if (e.target.classList.contains('nav__link')) {
    // getting the href of the element that was clicked remember this is not getting the element the event was set on which is ul
    const id = e.target.getAttribute('href');
    // making sure that it's not just # and has a specific place actually

    if (id !== '#') {
      smoothScrollToSection(document.querySelector(id));
    }
  }
});

// Event Delegation

operationTabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  // here we are avoid the bug where the user could click on the span element as its a child of the button so we are assigning the target to the closest class with the name of operations__tab
  const dispatchedClick = e.target.closest('.operations__tab');

  // modern way of stopping the event from going through if the result is not what was expected
  // in this case we are setting the click event on the container therefore the user could potentially click on the container itself which would result in future bugs
  // So we are saying if  you dont find the clostest operation tab class then stop the event
  if (!dispatchedClick) return;

  operationTabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });

  dispatchedClick.classList.add('operations__tab--active');

  operationContent.forEach(t => {
    t.classList.remove('operations__content--active');
  });
  // Changing the display using the data source in the html to reference to the correct content to display
  const displayElementText = document.querySelector(
    // data-tab[according to the clicked one is th value here]
    `.operations__content--${dispatchedClick.dataset.tab}`
  );
  displayElementText.classList.add('operations__content--active');
});

// navigation fade in / out

const navigation = document.querySelector('.nav');

// A Closure here is the best solution here because the event listner function will only receive an anonymous function or callback function therefore by returning tis function its gonna be as a regular anonymous function was written but in this case it can acess it's variables which waas the opacity arguement as a closure saves all its variables that were defined at birth
const handleHover = function (opacity) {
  return function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) {
          el.style.opacity = opacity;
        } else {
          el.classList.toggle('scale1-1');
        }
      });
      logo.style.opacity = opacity;
    }
  };
};
navigation.addEventListener('mouseover', handleHover(0.5));
navigation.addEventListener('mouseout', handleHover(1));

// STICKY NAVIGATION

// This way is not efficient becuase it's constantly returning the position of the scroll every time the user scrolls so can affect performance
// window.addEventListener('scroll', e => {
//   // to have a transition effect
//   if (btnScrollTo.getBoundingClientRect().y <= 0)
//     navigation.style.opacity = '0';
//   if (section1.getBoundingClientRect().y <= 0) {
//     navigation.style.opacity = '1';
//     navigation.classList.add('sticky');
//   } else {
//     navigation.style.opacity = '1';
//     navigation.classList.remove('sticky');
//   }
// });

// STICKY NAVIGATION WITH INTERSECTION Observer API

// here we are defining the navigation height
const navHeight = navigation.getBoundingClientRect().height;

//  this function takes 2 parameters the first one is the callback function what we want it to do and second is the options
// this callback function will only be initialized when the threshhold of the page is = to what we specified
const observerCallBack = function (entries) {
  if (!entries[0].isIntersecting) navigation.classList.add('sticky');
  else navigation.classList.remove('sticky');
};
const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // however its not good to hard code this because the height of the nav can change for example if its on a small screen then the margin offset will be more since the height of the nav is smaller so we need to add a dynamic margin
};
const observerHeader = new IntersectionObserver(
  observerCallBack,
  observerOptions
);
observerHeader.observe(header); // this becomes our target element when we call the obseve method on it

// Sections Fading in Animation

const sections = document.querySelectorAll('.section');
sections.forEach(section => section.classList.add('section--hidden'));

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionTarget = entry.target;
        sectionTarget.classList.remove('section--hidden');
        sectionObserver.unobserve(sectionTarget);
      }
    });
  },
  {
    root: null,
    threshold: 0.15, // we want it to show up 17% after part of it is shown only when 17% of it is showing in the viewport we will call the callback function
  }
);

// since we have many sections we have to observe all of them to figure out when one is coming into the viewport
sections.forEach(section => {
  sectionObserver.observe(section);
});

// Implementing The lazy Image Functionality

const featuresImages = document.querySelectorAll('img[data-src]');

const imgOptions = {
  root: null,
  threshold: 0, // so we are setting this to zero becuase we want the image to load in before actually arriving towards it
  rootMargin: ' 0px 0px -200px 0px',
};
const observerImages = new IntersectionObserver(entries => {
  // all the entries or elements that are targeted
  // console.log(entries);
  // representing our images each ones is assigned an entry
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      target.src = target.dataset.src;
      // so assuming we have a very slow connection we dont want the blur effect to be removed unless the new image is fully loaded so it does not create bad user experience as the image can take a longer time to load on slower connections
      target.addEventListener('load', function () {
        target.classList.remove('lazy-img');
      });
      observerImages.unobserve(target);
    }
  });
}, imgOptions);

featuresImages.forEach(img => observerImages.observe(img));

// feature text slide in effect

const featuresText = document.querySelectorAll('.features__feature');
featuresText.forEach(f => f.classList.add('feature__text-hidden'));
const featuresTextCallback = function (entries, observer) {
  entries.forEach(entry => {
    // Guard Clause stopping the function if the entry is not intersecting
    if (!entry.isIntersecting) return;
    const target = entry.target;
    target.classList.remove('feature__text-hidden');
    observer.unobserve(target);
  });
};
const featuresTextOptions = {
  root: null,
  threshold: 0.5,
};
const featuresTextObserver = new IntersectionObserver(
  featuresTextCallback,
  featuresTextOptions
);

featuresText.forEach(f => {
  f.classList.add('feature__text-hidden');
  featuresTextObserver.observe(f);
});

// tabbed Component buttons animation when scrolled
const tabbedComponentBtns = [...document.querySelectorAll('.operations__tab')];

const tabbedComponentBtnsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const btnTarget = entry.target;
      btnTarget.classList.remove(
        'operations__animation',
        'operations__animation2'
      );

      observer.unobserve(btnTarget);
    });
  },
  {
    root: null,
    threshold: 1,
    rootMargin: '-20px',
  }
);
tabbedComponentBtns.map((btn, index, array) => {
  tabbedComponentBtnsObserver.observe(btn);
  if (index === array.length - 1) {
    btn.classList.add('operations__animation');
  }
  if (index === 0) {
    btn.classList.add('operations__animation2');
  }
});

// Slider Component
const sliders = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');

  let currentSlide = 0;
  const maxSlide = slides.length; // 3
  // this is where the dots will be dynamically added according to the number of slides
  const dotsContainer = document.querySelector('.dots');

  // slider animation on scroll

  const sliderObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      entries[0].target.style.transform = 'translateX(0)';
      entries[0].target.style.opacity = '1';
      observer.unobserve(slider);
    },
    {
      root: null,
      threshold: 0.5,
    }
  );
  sliderObserver.observe(slider);

  const gotoSlide = function (currentSlideValue) {
    slides.forEach(function (slide, index) {
      slide.style.transform = `translateX(${
        100 * (index - currentSlideValue)
      }%)`; // in the first iteration is = -100%
    });
  };

  // Pagination Functionality
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // activating the dots to work when sliding
  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      // converting this dot to a number as the result received comes out as a string therefore when comparing it to the currentSlide which is a type of a number it gets undefined
      if (+dot.dataset.slide === slide) {
        dot.classList.add('dots__dot--active');
      }
    });
  };

  // Prev Slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1; // 2
    } else {
      currentSlide--;
    }
    gotoSlide(currentSlide);
    activateDots(currentSlide);
  };

  // Next Slide
  const nextSlide = function () {
    // in the first iteration the currentSlide will be equal to 0 and the max slide - 1 = 2 we are checking if 0 is equal to 2 which that is not the case
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      // the reason we did this is because we want to move to the next slide
      currentSlide++;
    }

    // when we call this function the value will be equal to 1
    gotoSlide(currentSlide);
    activateDots(currentSlide);
  };
  const init = function () {
    gotoSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  sliderBtnRight.addEventListener('click', nextSlide);

  sliderBtnLeft.addEventListener('click', prevSlide);

  // for the slide to show up the transfrom translteX should = 0%

  dotsContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('dots__dot')) return;
    const dotTarget = e.target;
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    dotTarget.classList.add('dots__dot--active');
    gotoSlide(dotTarget.dataset.slide);
  });

  // arrow Left and Right

  const arrowRight = function (ArrowKeyName) {
    document.addEventListener('keydown', e => {
      if (e.key === `${ArrowKeyName}`) {
        nextSlide();
        activateDots(currentSlide);
      }
    });
  };
  arrowRight('ArrowRight');

  const arrowLeft = function (ArrowKeyName) {
    document.addEventListener('keydown', e => {
      if (e.key === `${ArrowKeyName}`) {
        prevSlide();
        activateDots(currentSlide);
      }
    });
  };
  arrowLeft('ArrowLeft');
};
sliders();

document.addEventListener('DOMContentLoaded', e =>
  console.log('DOMContentLoaded', e)
);
