
import { scroll, animate, ScrollOffset } from "https://cdn.skypack.dev/motion@10.13.1"

const $sectionPin = document.querySelector("#sectionPin");
const $slidingContent = document.querySelector(".pin-wrap");

const sectionHeightInVh = 500; // 👈 The scrolling distance over which the horizontal section should slide across

// Adjust wrapper
// - Change height so that we have room to scroll in
// - Add fix to make position: sticky work
$sectionPin.style.height = `${sectionHeightInVh}vh`;
$sectionPin.style.overflow = `visible`;

// Adjust content
// - Make it stick to the top
$slidingContent.style.position = "sticky";
$slidingContent.style.top = 0;

scroll(
	animate($slidingContent, {transform: ["translateX(0)", `translateX(calc(-100% + 100vw))`]}),
	{
		target: $sectionPin,
		offset: ScrollOffset.enter,
	}
);