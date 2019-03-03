const [sectionTitle1, sectionTitle2, sectionTitle3, sectionTitle4, sectionTitle5] = document.querySelectorAll('.section__title');
const [appear2, appear3, appear4, appear5] = document.querySelectorAll('.will-appear');


observeElement({
  element: sectionTitle1,
  whenInView: () => console.log('Section 1 in view')
});

observeElement({
  element: sectionTitle2,
  whenInView: () => slideInElement(appear2, 'right')
});

observeElement({
  element: sectionTitle3,
  whenInView: () => slideInElement(appear3, 'left')
});

observeElement({
  element: sectionTitle4,
  whenInView: () => slideInElement(appear4, 'right')
});

observeElement({
  element: sectionTitle5,
  whenInView: () => slideInElement(appear5, 'left')
});


function slideInElement(element, fromPosition) {
  let className = `slide-in-${fromPosition}`;

  return element.classList.add(className);
}




function observeElement({ element, whenInView, whenOutOfView, onlyOnce, rootMargin = '0px', threshold = [0] }) {
    if (!element) { return; }
    const config = { rootMargin, threshold };
  
    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          if (whenInView) { whenInView(); }
          if (onlyOnce) { observer.unobserve(entry.target); }
        } else {
          if (whenOutOfView) { whenOutOfView(); };
        }
      });
    }, config);
  
    observer.observe(element);
  }
