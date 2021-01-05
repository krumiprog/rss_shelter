let hamburger = document.querySelector('.hamburger')
let cardBtn = document.querySelector('.card__button')
let notOnlyBtn = document.querySelector('.not-only__button')
let ourFriendsBtn = document.querySelector('.our-friends__button')
let sidebar = document.querySelector('.sidebar')
let shadowed = document.querySelector('.shadowed')
let popup = document.querySelector('.popup')
let headerLogo = document.querySelector('header .logo')
let disabledLinks = document.querySelectorAll('.list__item:nth-child(n+3) .list__link');
let leftArrow = document.querySelector('.button_arrow.left')
let rightArrow = document.querySelector('.button_arrow.right')
let items = document.querySelectorAll('.item')
let cardButtons = document.querySelectorAll('.pets-card .button_bordered')

let navbarOpen = false;
let isEnabled = true
let cardsOnScreen = 0
let currentItem = 0
let prevItem = 0
let petsFromFile = []
let prevCardRandIndexes = []

readJson()

disabledLinks.forEach(link => {
  link.classList.add('list__link_disabled')
})

hamburger.addEventListener('click', () => {
  navbarOpen = !navbarOpen;
  if (navbarOpen) {
    headerLogo.style.opacity = '0'
    shadowed.style.display = 'block'
    hamburger.classList.add('hamburger_rotate')
    sidebar.classList.add('sidebar_active')
    document.body.classList.add('stop-scroll')
  } else {
    headerLogo.style.opacity = '1'
    shadowed.style.display = 'none'
    hamburger.classList.remove('hamburger_rotate')
    sidebar.classList.remove('sidebar_active')
    document.body.classList.remove('stop-scroll')
  }
})

cardBtn.addEventListener('click', () => {
  popup.style.display = 'none'
  document.body.classList.remove('stop-scroll')
})

notOnlyBtn.addEventListener('click', () => {
  document.location = '../pets/index.html'
})

ourFriendsBtn.addEventListener('click', () => {
  document.location = '../pets/index.html'
})

shadowed.addEventListener('click', () => {
  hamburger.click()
})

popup.addEventListener('click', (event) => {
  if (event.target.className !== 'popup') {
    return
  }
  cardBtn.click()
})

popup.addEventListener('mouseover', (event) => {
  if (event.target.className !== 'popup') {
    cardBtn.classList.remove('hover')
    return;
  }
  cardBtn.classList.add('hover')
})

async function readJson() {
  await fetch('../../pets.json')
    .then(response => response.json())
    .then(json => {
      petsFromFile = Object.values(json)
    })

  initCards()
}

function initCards() {
  setCardsOnScreen()
  items.forEach(item => {
    createCards(item)
    hideShowCards(item)
  })
}

function setCardsOnScreen() {
  if (document.body.clientWidth >= 1280) {
    cardsOnScreen = 3
  } else if (document.body.clientWidth >= 768) {
    cardsOnScreen = 2
  } else {
    cardsOnScreen = 1
  }
}

function randomCards() {
  let indexes = []
  let randIndex = 0

  for (let i = 0; i < 3; i++) {
    do {
      randIndex = Math.floor(Math.random() * petsFromFile.length);
    } while ((prevCardRandIndexes.indexOf(randIndex) !== -1) || (indexes.indexOf(randIndex) !== -1));
    indexes.push(randIndex)
  }

  prevCardRandIndexes = indexes
  return indexes
}

function createCards(item) {
  let randIndexes = randomCards()
  let itemPets = item.children
  for (let i = 0; i < itemPets.length; i++) {
    let pet = petsFromFile[randIndexes[i]]
    itemPets[i].setAttribute('id', randIndexes[i])
    itemPets[i].children[0].setAttribute('src', pet.img)
    itemPets[i].children[0].setAttribute('alt', pet.type)
    itemPets[i].children[1].innerText = pet.name
    itemPets[i].addEventListener('click', (event) => {
      if (event.currentTarget.className === 'pets-card') {
        itemPets[i].querySelector('.button_bordered').click()
      }
    }, {capture: true})
  }
}

function hideShowCards(item) {
  let children = item.children
  for (let i = 0; i < children.length; i++) {
    if (i < cardsOnScreen) {
      children[i].style.display = 'flex'
    } else {
      children[i].style.display = 'none'
    }
  }
}

function changeCurrentItem(n) {
  currentItem = (n + items.length) % items.length
}

function nextItem(n) {
  prevItem = n
  hideItem('to-left')
  changeCurrentItem(n + 1)
  showItem('from-right')
  setTimeout(() => createCards(items[prevItem]), 500)
}

function previousItem(n) {
  prevItem = n
  hideItem('to-right')
  changeCurrentItem(n - 1)
  showItem('from-left')
  setTimeout(() => createCards(items[prevItem]), 500)
}

function hideItem(direction) {
  isEnabled = false;
	items[currentItem].classList.add(direction);
	items[currentItem].addEventListener('animationend', function() {
    this.classList.remove('active', direction);
	});
}

function showItem(direction) {
	items[currentItem].classList.add('next', direction);
	items[currentItem].addEventListener('animationend', function() {
		this.classList.remove('next', direction);
    this.classList.add('active');
    isEnabled = true;
	});
}

leftArrow.addEventListener('click', () => {
	if (isEnabled) {
		previousItem(currentItem)
	}
})

rightArrow.addEventListener('click', () => {
	if (isEnabled) {
		nextItem(currentItem)
	}
})

window.onresize = function(event) {
  setCardsOnScreen()
  items.forEach(item => {
    hideShowCards(item)
  })
}

cardButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    let petSelect = petsFromFile[event.target.parentElement.getAttribute('id')] 
    document.querySelector('.card__image').innerHTML = `<img src="${petSelect.img}" alt="${petSelect.type}">`
    document.querySelector('.card__text').innerHTML = `
        <h3 class="card__name">${petSelect.name}</h3>
        <h4><span class="card__type">${petSelect.type}</span> - <span class="card__breed">${petSelect.breed}</span></h4>
        <div class="card__description">${petSelect.description}</div>
        <ul class="card__list">
          <li><span><strong>Age: </strong><span class="card__age">${petSelect.age}</span></span></li>
          <li><span><strong>Inoculations: </strong><span class="card__inoculation">${petSelect.inoculations}</span></span></li>
          <li><span><strong>Diseases: </strong><span class="card__diseases">${petSelect.diseases}</span></span></li>
          <li><span><strong>Parasites: </strong><span class="card__parasites">${petSelect.parasites}</span></span></li>
        </ul>`
    popup.style.display = 'flex'
    document.body.classList.add('stop-scroll')
  })
})
