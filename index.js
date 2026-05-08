let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
let cartCountEl = document.getElementById("cart-count");
if(cartCountEl) cartCountEl.textContent = cartCount;

function updateCartCount() {
    if(cartCountEl) cartCountEl.textContent = cartCount;
    localStorage.setItem('cartCount', cartCount);
}

document.querySelectorAll(".add").forEach(function(button){
  button.addEventListener("click", function(e){
    cartCount++;
    updateCartCount();
    
    button.style.transform = "scale(1.2)";
    setTimeout(()=>{button.style.transform="scale(1)";}, 150);
    
    // Название товара
    let card = button.closest('.card');
    let title = card ? card.querySelector('h3')?.innerText : 'Товар';
    showToast(`✅ ${title} добавлен в корзину!`);
  });
});

function showToast(message, isError = false) {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${isError ? '#D6232A' : '#1e3a2f'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: fadeInOut 2.5s ease forwards;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); visibility: hidden; }
    }
`;
document.head.appendChild(style);

let bookingForm = document.getElementById("booking-form");
if(bookingForm){
  bookingForm.addEventListener("submit", function(event){
    event.preventDefault();
    
    let name = document.getElementById("booking-name")?.value.trim();
    let phone = document.getElementById("booking-phone")?.value.trim();
    let date = document.getElementById("booking-date")?.value;
    let time = document.getElementById("booking-time")?.value;
    let guests = document.getElementById("booking-guests")?.value;
    
    let isValid = true;
    if(!name || name.length < 2){
      showError("name-error", "Введите корректное имя");
      isValid = false;
    } else clearError("name-error");
    
    if(!phone || phone.length < 10){
      showError("phone-error", "Введите корректный телефон");
      isValid = false;
    } else clearError("phone-error");
    
    if(!date){
      showToast("Выберите дату", true);
      isValid = false;
    }
    if(!time){
      showToast("Выберите время", true);
      isValid = false;
    }
    
    if(isValid){
      let resultDiv = document.getElementById("booking-result");
      if(resultDiv){
        resultDiv.className = "result-message success";
        resultDiv.innerHTML = `✅ Спасибо, ${name}! Столик на ${date} в ${time} для ${guests} чел. подтверждён. Мы вам перезвоним на ${phone}.`;
        setTimeout(() => {
          resultDiv.style.display = "none";
        }, 5000);
      }
      bookingForm.reset();
      showToast("🎉 Столик успешно забронирован!");
    }
  });
}

function showError(elementId, message){
  let el = document.getElementById(elementId);
  if(el) el.textContent = message;
}
function clearError(elementId){
  let el = document.getElementById(elementId);
  if(el) el.textContent = "";
}

let loginForm = document.getElementById("login-form");
let registerForm = document.getElementById("register-form");
let tabBtns = document.querySelectorAll(".tab-btn");
let profileResult = document.getElementById("profile-result");

if(tabBtns.length){
  tabBtns.forEach(btn => {
    btn.addEventListener("click", function(){
      tabBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      let tab = this.dataset.tab;
      if(loginForm && registerForm){
        if(tab === "login"){
          loginForm.classList.add("active");
          registerForm.classList.remove("active");
        } else {
          loginForm.classList.remove("active");
          registerForm.classList.add("active");
        }
      }
    });
  });
}

let profileForm = document.getElementById("profile-form");
if(profileForm){
  profileForm.addEventListener("submit", function(event){
    event.preventDefault();
    let email = document.getElementById("login-email")?.value.trim();
    let password = document.getElementById("login-password")?.value;
    
    if(email && password){
      if(profileResult){
        profileResult.className = "result-message success";
        profileResult.innerHTML = `✅ Добро пожаловать, ${email.split('@')[0]}!`;
        setTimeout(() => profileResult.style.display = "none", 3000);
      }
      showToast("✅ Вход выполнен успешно!");
      profileForm.reset();
    } else {
      showToast("❌ Заполните все поля", true);
    }
  });
}

let registerBtn = document.getElementById("register-btn");
if(registerBtn){
  registerBtn.addEventListener("click", function(){
    let name = document.getElementById("reg-name")?.value.trim();
    let email = document.getElementById("reg-email")?.value.trim();
    let phone = document.getElementById("reg-phone")?.value.trim();
    let pass = document.getElementById("reg-password")?.value;
    let passConfirm = document.getElementById("reg-password-confirm")?.value;
    
    if(!name || !email || !phone || !pass){
      showToast("❌ Заполните все поля", true);
      return;
    }
    if(pass !== passConfirm){
      showToast("❌ Пароли не совпадают", true);
      return;
    }
    if(pass.length < 6){
      showToast("❌ Пароль должен быть не менее 6 символов", true);
      return;
    }
    
    if(profileResult){
      profileResult.className = "result-message success";
      profileResult.innerHTML = `✅ Регистрация прошла успешно! Войдите в аккаунт, ${name}.`;
      setTimeout(() => profileResult.style.display = "none", 3000);
    }
    showToast("🎉 Регистрация успешна! Теперь войдите.");
    
    if(tabBtns.length){
      tabBtns[0].click();
    }
    document.querySelectorAll("#register-form input").forEach(inp => inp.value = "");
  });
}

function filterMenu(category){
  let cards = document.querySelectorAll(".card");
  let btns = document.querySelectorAll(".filters button");
  
  btns.forEach(btn => btn.classList.remove("active"));
  if(event && event.target) event.target.classList.add("active");
  
  cards.forEach(card => {
    if(category === "all" || card.dataset.category === category){
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function sortMenu(type){
  let grid = document.getElementById("menu-grid");
  if(!grid) return;
  let cards = Array.from(grid.children);
  
  cards.sort((a,b) => {
    let aPrice = parseFloat(a.dataset.price);
    let bPrice = parseFloat(b.dataset.price);
    if(type === "low") return aPrice - bPrice;
    if(type === "high") return bPrice - aPrice;
    return 0;
  });
  
  cards.forEach(card => grid.appendChild(card));
}

let slider = document.querySelector(".grid");
if(slider){
  slider.addEventListener("wheel", (e) => {
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
  });
}

function scrollMenu(value){
  let grid = document.querySelector(".grid");
  if(grid) grid.scrollLeft += value;
}

let contactForm = document.getElementById("contact-form");
if(contactForm){
  contactForm.addEventListener("submit", function(e){
    e.preventDefault();
    showToast("📨 Спасибо! Ваше сообщение отправлено.");
    contactForm.reset();
  });
}
let orderBtn = document.querySelector(".order");
let reserveBtn = document.querySelector(".reserve");

if(orderBtn){
  orderBtn.addEventListener("click", function() {
    window.location.href = "menu.html";
  });
}

if(reserveBtn){
  reserveBtn.addEventListener("click", function() {
    window.location.href = "booking.html";
  });
}