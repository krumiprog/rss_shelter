let hamburger = document.querySelector('.hamburger')
let sideHamburger = document.querySelector('.sidebar .hamburger')
let cardBtn = document.querySelector('.card__button')
let sidebar = document.querySelector('.sidebar')
let shadowed = document.querySelector('.shadowed')
let popup = document.querySelector('.popup')
let headerLogo = document.querySelector('header .logo')
let disabledLinks = document.querySelectorAll('.list__item:nth-child(n+3) .list__link');
let btnFirst = document.querySelector('.button_first')
let btnPrev = document.querySelector('.button_prev')
let btnCur = document.querySelector('.button_current')
let btnNext = document.querySelector('.button_next')
let btnLast = document.querySelector('.button_last')

disabledLinks.forEach(link => {
  link.classList.add('list__link_disabled')
})

hamburger.addEventListener('click', () => {
  headerLogo.style.opacity = '0'
  shadowed.style.display = 'block'
  hamburger.classList.add('hamburger_rotate')
  sideHamburger.classList.add('hamburger_rotate')
  sidebar.classList.add('sidebar_active')
  document.body.classList.add('stop-scroll')
})

sideHamburger.addEventListener('click', () => {
  headerLogo.style.opacity = '1'
  shadowed.style.display = 'none'
  hamburger.classList.remove('hamburger_rotate')
  sideHamburger.classList.remove('hamburger_rotate')
  sidebar.classList.remove('sidebar_active')
  document.body.classList.remove('stop-scroll')
})

cardBtn.addEventListener('click', () => {
  popup.style.display = 'none'
  document.body.classList.remove('stop-scroll')
})

shadowed.addEventListener('click', () => {
  sideHamburger.click()
})

popup.addEventListener('click', (event) => {
  if (event.target.className !== 'popup') {
    return;
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


let cardsViewport = document.querySelector('.cards-viewport')
let cards = document.querySelector('.cards')

let pets = []
let fullPetsList = []

fetch('../../pets.json')
  .then(res => res.json())
  .then(list => {
  
  pets = list;

  fullPetsList = (() => {
    let tempArr = []
    for (let i = 0; i < 6; i++) {
      const newPets = pets
      for (let j = pets.length; j > 0; j--) {
        let randInd = Math.floor(Math.random() * j)
        const randElem = newPets.splice(randInd, 1)[0]
        newPets.push(randElem)
      }
      tempArr = [...tempArr, ...newPets]
    }
    return tempArr
  })()

  fullPetsList = sort863(fullPetsList)
  createPets(fullPetsList)
  let cardButtons = document.querySelectorAll('.pets-card .button_bordered')
  setButtonListener(cardButtons)
  let petCards = document.querySelectorAll('.pets-card')
  petCards.forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.currentTarget.className === 'pets-card') {
        card.querySelector('.button_bordered').click()
      }
    }, {capture: true})
  })
  calcPageValues()
})

const createPets = (petsList) => {
  let str = ''
  petsList.forEach((item, index) => {
    str += `<div class="pets-card" id="${index}">
              <img src="${item.img}" alt="${item.type}">
              <div class="pets-card__title">${item.name}</div>
              <button class="button_bordered">Learn more</button>
            </div>`
  })
  cards.innerHTML = str
}

const sort863 = (list) => {
  let unique8List = []
  let length = list.length

  for (let i = 0; i < length / 8; i++) {
    const uniqueStepList = []

    for (j = 0; j < list.length; j++) {
      if (uniqueStepList.length >= 8) {
        break
      }
      const isUnique = !uniqueStepList.some((item) => {
        return item.name === list[j].name
      })
      if (isUnique) {
        uniqueStepList.push(list[j])
        list.splice(j, 1)
        j--
      }
    }
    unique8List = [...unique8List, ...uniqueStepList]
  }
  list = unique8List
  list = sort6recursively(list)
  return list
}

const sort6recursively = (list) => {
  const length = list.length

  for (let i = 0; i < (length / 6); i++) {
    const stepList = list.slice(i * 6, (i * 6) + 6)

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && (ind !== j)
      })
      if (duplicatedItem !== undefined) {
        const ind = (i * 6) + j
        const which8OfList = Math.trunc(ind / 8)
        list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0])
        sort6recursively(list);
      }
    }
  }
  return list
}

const setButtonListener = (buttons) => {
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      let petSelect = fullPetsList[event.target.parentElement.getAttribute('id')] 
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
}

let widthCardsBlock = 0
let heightCardsBlock = 0
let cardsOnPage = 0
let totalPages = 0
let currentPage = 0
let prevCardsOnPage = 0
let isChangeCardsOnScreen = false

window.onresize = function(event) {
  calcPageValues()
  if (isChangeCardsOnScreen) {
    btnFirst.click()
  }
}

function calcPageValues() {
  setCardsOnScreen()
  cards.style.maxWidth = `${widthCardsBlock}px`
  cardsViewport.style.height = `${heightCardsBlock}px`
  totalPages = fullPetsList.length / cardsOnPage
  setPaginationButtons()
}

function setCardsOnScreen() {
  let prevCardsOnPage = cardsOnPage
  isChangeCardsOnScreen = false

  if (document.body.clientWidth >= 1280) {
    widthCardsBlock = 1200
    heightCardsBlock = 900
    cardsOnPage = 8
  } else if (document.body.clientWidth >= 768) {
    widthCardsBlock = 580
    heightCardsBlock = 1365
    cardsOnPage = 6
  } else {
    widthCardsBlock = 270
    heightCardsBlock = 1365
    cardsOnPage = 3
  }
  if (cardsOnPage !== prevCardsOnPage) {
    isChangeCardsOnScreen = true
  }
}

btnFirst.addEventListener('click', () => {
  cards.style.top = '0'
  currentPage = 0
  setPaginationButtons()
})

btnPrev.addEventListener('click', () => {
  currentPage--
  cards.style.top = `calc(0px - ${currentPage} * (${heightCardsBlock}px + ${window.getComputedStyle(cards).rowGap}))`
  setPaginationButtons()
})

btnCur.addEventListener('click', () => {
  return
})

btnNext.addEventListener('click', () => {
  currentPage++
  cards.style.top = `calc(0px - ${currentPage} * (${heightCardsBlock}px + ${window.getComputedStyle(cards).rowGap}))`
  setPaginationButtons()
})

btnLast.addEventListener('click', () => {
  cards.style.top = `calc(0px - ${totalPages - 1} * (${heightCardsBlock}px + ${window.getComputedStyle(cards).rowGap}))`
  currentPage = totalPages - 1
  setPaginationButtons()
})

function setPaginationButtons() {
  btnCur.innerHTML = currentPage + 1
  if (currentPage === 0) {
    btnFirst.disabled = true
    btnPrev.disabled = true
    btnNext.disabled = false
    btnLast.disabled = false
  } else if (currentPage === totalPages - 1) {
    btnFirst.disabled = false
    btnPrev.disabled = false
    btnNext.disabled = true
    btnLast.disabled = true
  } else {
    btnFirst.disabled = false
    btnPrev.disabled = false
    btnNext.disabled = false
    btnLast.disabled = false
  }
}
