
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


function loadTheme(theme) {
	const id = Math.floor(1000 + Math.random() * 9000); //To generate a random 4 digit number
	const link = document.querySelector("link");
	link.href = `${theme}.css?id=${id}`; //Add the ID so the CSS file is unique each load. This prevents browser caching.
}

// Same eventListener but calling loadTheme() with applicable parameter
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
	const modeChange = event.matches ? "dark" : "light";
	const autoMode = document.querySelector(".selected");
	if (autoMode.classList.contains("auto")) {
		if (modeChange === "dark") {
			loadTheme("dark");
		} else {
			loadTheme("light");
		}
	}
});

import gsap from 'https://cdn.skypack.dev/gsap@3.11.0'

console.clear()

const CANVAS = document.querySelector('#rain')

const DEFAULT_OPTIONS = {
  size: () => window.innerWidth * 0.015,
  family: 'JetBrains Mono, monospace',
  fps: 24,
  hue: 120,
  limiter: 0.25,
  glyphs:
    'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  // glyphs: '01'

}

const DigitalRain = function (el, options) {
  if (el.tagName !== 'CANVAS') return console.error('Need a canvas element')
  const self = this
  self.__ratio = window.devicePixelRatio || 1
  self.canvas = el
  self.options = options
  self.size = options.size
  self.glyphs = self.options.glyphs.split('')
  self.context = el.getContext('2d')
  self.setSize()
  self.setTracker()
  self.init()
  return self
}

// Sending back a column Object that represents the state of a column
DigitalRain.prototype.setColumn = function (column = {}) {
  const self = this
  const { glyphs } = self
  // Set a destination and record len && lastLen
  const len = gsap.utils.random(6, self.rows, 1)
  const lastLen = column.len || len
  // const destination = self.rows + len
  const destination = gsap.utils.random(self.rows * 0.1, self.rows + len, 1)
  const lastDestination = column.destination || destination
  // Tracking the last Destination needs a tail off to roll out the old stream
  const tailEnd = lastDestination + lastLen

  // If you have column.chars reuse else reset up to destination
  let chars = column.chars || []

  // When you come in, cache the last set of chars
  let cacheChars = [...chars]

  chars = new Array(Math.max(destination, chars.length)).fill().map((entry, index) => {
    if (index <= destination) {
      return self.glyphs[gsap.utils.random(0, self.glyphs.length - 1, 1)]
    } else {
      return cacheChars[index]
    }
  })

  const row = gsap.utils.random(-self.rows, -1, 1)

  // column.hue = column.hue || gsap.utils.random(0, 359, 1)

  return {
    ...column,
    chars,
    cacheChars,
    destination,
    lastDestination,
    lastLen,
    tailEnd,
    tailCounter: lastDestination,
    row,
    len,
  }
}

DigitalRain.prototype.setTracker = function () {
  const self = this
  self.tracker = new Array(self.columns).fill().map(() => self.setColumn())
}

DigitalRain.prototype.reset = function () {
  const self = this
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
  self.setSize()
  self.setTracker()
}

DigitalRain.prototype.init = function () {
  const self = this
  self.renderMatrix = () => self.render()
  self.resetOnSize = () => self.reset()
  window.addEventListener('resize', self.resetOnSize)
  gsap.ticker.add(self.renderMatrix)
  gsap.ticker.fps(self.options.fps)
  self.pause = () => {
    gsap.ticker.remove(self.renderMatrix)
  }
  self.play = () => {
    gsap.ticker.add(self.renderMatrix)
  }
}

DigitalRain.prototype.getColor = function (
  x,
  y,
  {
    hue,
    row,
    len,
    lastLen,
    lastDestination,
    tailCounter,
  }
) {
  const self = this
  // If y > row but less than last destination, work out the color as if row === column.lastDestination
  const lower = 0.1
  const upper = 1
  let alpha = 0.1

  if (y <= row) {
    alpha = gsap.utils.clamp(
      lower,
      upper,
      gsap.utils.mapRange(-len, 0, lower, upper)(y - row)
    )
  } else if (y > row && y <= lastDestination) {
    alpha = gsap.utils.clamp(
      lower,
      upper,
      gsap.utils.mapRange(-lastLen, 0, lower, upper)(y - tailCounter)
    )
  } else if (y > lastDestination) {
    alpha = lower
  }
  return `hsl(${hue || self.options.hue}, 100%, ${row === y ? 100 : 70}%, ${alpha})`
}

DigitalRain.prototype.render = function () {
  const self = this
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
  // Need to try and iterate over every cell in the Matrix...
  for (let c = 0; c < self.characters; c++) {
    const x = c % self.columns
    const y = Math.floor(c / self.columns)
    const column = self.tracker[x]

    // On the first row, let's bump the index
    if (y === 0 && Math.random() > 0.1) {
      column.row += 1
    }

    if (column.tailCounter !== column.tailOff && y === 0) {
      column.tailCounter += 1
    }

    const row = column.row
    const chars = column[y > row ? 'cacheChars' : 'chars']
    
    self.context.fillStyle = self.getColor(x, y, column)


    if (chars[y]) {
      if (Math.random() > 0.999 && y > row) {
        column.cacheChars[y] = column.chars[y] = ''
      }
      if (Math.random() > 0.99 && (y < row && y < column.destination && y > (column.destination - column.len))) {
        column.cacheChars[y] = column.chars[y] = self.glyphs[gsap.utils.random(0, self.glyphs.length - 1, 1)]
      }
      self.context.fillText(
        chars[y],
        (x + 0.5) * self.fontSize,
        (y + 1) * self.fontSize
      )
    }
    // Reset the column if we go past destination
    if (row > column.destination) {
      self.tracker[x] = self.setColumn(column)
    }
  }
}

DigitalRain.prototype.setSize = function () {
  const self = this
  const { height, width } = self.canvas.getBoundingClientRect()
  self.canvas.height = height * self.__ratio
  self.canvas.width = width * self.__ratio
  // Set the font size and get the rows/columns
  self.fontSize = Math.ceil(typeof self.size === 'function' ? self.size() : self.size)
  self.columns = Math.ceil(self.canvas.width / self.fontSize)
  // self.columns = 1
  self.rows = Math.ceil(self.canvas.height / self.fontSize)
  self.characters = self.rows * self.columns
  self.context.font = `${self.fontSize}px ${self.options.family}`
  self.context.textAlign = 'center'
}

window.myDigitalRain = new DigitalRain(CANVAS, DEFAULT_OPTIONS)


