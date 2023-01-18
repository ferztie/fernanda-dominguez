
import { scroll, animate, ScrollOffset } from "https://cdn.skypack.dev/motion@10.13.1"

const $sectionPin = document.querySelector("#sectionPin");
const $slidingContent = document.querySelector(".pin-wrap");

const sectionHeightInVh = 500; 

// Adjust wrapper
$sectionPin.style.height = `${sectionHeightInVh}vh`;
$sectionPin.style.overflow = `visible`;

// Adjust content
$slidingContent.style.position = "sticky";
$slidingContent.style.top = 0;

scroll(
	animate($slidingContent, {transform: ["translateX(0)", `translateX(calc(-100% + 100vw))`]}),
	{
		target: $sectionPin,
		offset: ScrollOffset.enter,
	}
)

let tabContent = document.querySelectorAll(".container__inner");
let tabItem = document.querySelectorAll(".container__item");

// For each element with class 'container__item'
for (let i = 0; i < tabItem.length; i++) {
  // if the element was hovered
  //you can replace mouseover with click
  tabItem[i].addEventListener("mouseover", () => {
    // Add to all containers class 'container__inner_hidden'
    tabContent.forEach((item) => {
      item.classList.add("container__inner_hidden");
    });
    // Clean all links from class 'container__item_active'
    tabItem.forEach((item) => {
      item.classList.remove("container__item_active");
    });
    // Make visible correct tab content and add class to item
    tabContent[i].classList.remove("container__inner_hidden");
    tabItem[i].classList.add("container__item_active");
  });
}


