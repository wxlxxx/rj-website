import '../style/main.scss';
import 'bootstrap';
import 'slick-carousel';
import $ from 'jquery';
import { CountUp } from 'countup.js';
import { throttle, debounce } from 'throttle-debounce';

// countup
(function myCountUp(){
  const countups = document.querySelectorAll('.countup')
  if(countups.length > 0){
    countups.forEach(element => {
      element.countUp = new CountUp(element, element.innerText)
    })
    if(window._scrollHandle){
      return
    }
    window._scrollHandle = () => {
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
    window.addEventListener('scroll', throttle(500,window._scrollHandle))
  }
})()

window.$ = $
