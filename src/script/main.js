import '../style/main.scss';
import 'bootstrap';
import 'slick-carousel';
import $ from 'jquery';
import { CountUp } from 'countup.js';
import { throttle, debounce } from 'throttle-debounce';
import 'social-share.js/dist/js/social-share.min.js';

const countups = null
const toTop = document.querySelectorAll('.totop')[0] || null
// countup
(function(){
  countups = document.querySelectorAll('.countup')
  if(countups.length > 0){
    countups.forEach(element => {
      element.countUp = new CountUp(element, element.innerText)
    })
  }
})();

(function(){
  if(!toTop || toTop._clickHandle){
    return
  }
  toTop._clickHandle = () => {
    const scrollToTop = () => {
        let sTop = document.documentElement.scrollTop || document.body.scrollTop
        if (sTop > 0) {
            window.requestAnimationFrame(scrollToTop)
            window.scrollTo(0, sTop - sTop / 8)
        }
    }
    scrollToTop()
  }
  toTop.addEventListener('click', toTop._clickHandle)
})();

(function(){
  if(window._scrollHandle){
    return
  }
  window._scrollHandle = () => {
    if(countups){
      countups.forEach(element => {
        const offset = element.getBoundingClientRect()
        const offsetTop = offset.top
        const offsetBottom = offset.bottom
        const offsetHeight = offset.height
        if(offsetTop <= window.innerHeight && offsetBottom >= 0){
          element.countUp.start()
        }else {
          element.countUp.reset()
        }
      })
    }
    if(toTop){
      if(window.scrollY >= 150){
        $(toTop).fadeIn()
      }else {
        $(toTop).fadeOut()
      }
    }
  }
  window.addEventListener('scroll', throttle(500,window._scrollHandle))
})();

(function(){
  if($('[data-toggle="tab"]').length > 0){
    $(window.location.hash).tab('show')
    $(window).on('hashchange', function(){
      $(window.location.hash).tab('show')
    })
  }
})();

(function(){
  if(window.location.hash.match('#wpcf7') != null){
    $('#modal-submit-success').modal()
    $('#modal-submit-success').on('hidden.bs.modal', function (e) {
      window.location.replace(window.location.origin + window.location.pathname)
    })
  }
})();

window.$ = $
