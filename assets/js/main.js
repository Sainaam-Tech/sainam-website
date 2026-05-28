// Project override of themes/hugoplate/assets/js/main.js.
// Upstream uses loop:true which Swiper implements by cloning slides into the
// DOM at init — that duplicates testimonial text post-render and lowers the
// LLM static-content score. With loop:false the static HTML matches the DOM.
(function () {
  "use strict";

  new Swiper(".testimonial-slider", {
    spaceBetween: 24,
    loop: false,
    pagination: {
      el: ".testimonial-slider-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
})();
