const resendBtn = document.querySelector('.resend-email__link');
const cancelBtn = document.querySelector('.recovery-modal__btn--cancel');
const secondsBox = document.querySelector('.resend-email__sec');
const recoveryForm = document.querySelector('.recovery-modal__form');

togglePasswordVisibility();
closeRecoveryForm();
showResendBtn();
sendEmailAgain();

function togglePasswordVisibility() {
  const toggleBtns = document.querySelectorAll('.toggle-password__btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => { 
      btn.classList.toggle('show');
      if (btn.nextElementSibling.type === 'password') {
        btn.nextElementSibling.type = "text";
      } else {
        btn.nextElementSibling.type = "password";
      }
    });
  });
}

function showResendBtn() {
  recoveryForm.addEventListener('submit', e => {
    e.preventDefault();
    recoveryForm.classList.add('resend');
    activateResendBtn();
    cancelBtn.textContent = 'Okay, thank!';
  });
}

function activateResendBtn() { 
  startTimer(30);
  sendEmailAgain();
}

function sendEmailAgain() {
  resendBtn.addEventListener('click', () => {
    resendTimer(30, secondsBox);
    resendBtn.classList.add('isDisabled');
    startTimer(30);
  });
}

function startTimer(seconds) {
  const ms = seconds * 1000;
  resendTimer(30, secondsBox);

  setTimeout(() => {
    resendBtn.classList.remove('isDisabled');
  }, ms);
}

function resendTimer(seconds, container) {
  const ms = seconds * 1000;
  container.innerHTML = seconds;

  const timerId = setInterval(() => {
    container.innerHTML = --seconds;
  }, 1000);

  setTimeout(() => {
    clearInterval(timerId);
  }, ms);

  closeRecoveryForm(timerId);
}
function closeRecoveryForm(id) {
  cancelBtn.addEventListener('click', () => {
    recoveryForm.classList.remove('resend');
    recoveryForm.reset();
    clearInterval(id);
    cancelBtn.textContent = 'Cancel';
  });
}

function escapeCloseLogInModal() {
  const logInModal = document.getElementById('logInModal');
  const recoveryModal = document.getElementById('recoveryModal');

  recoveryModal.addEventListener('shown.bs.modal', function () {
    logInModal.modal({backdrop: 'static', keyboard: false});
  });
}


function signUpForm() {
  const form = document.querySelector('.sign-up__form');
  const formBtn = document.querySelector('.sign-up__btn');
  const stepsItemFirst = document.querySelector('.sign-up-steps__item--first');
  const stepsItemSecond = document.querySelector('.sign-up-steps__item--second');

  
  formBtn.addEventListener('click', e => {
    e.preventDefault();
    form.classList.add('first-step-success');
    stepsItemFirst.classList.remove('active-step');
    stepsItemFirst.classList.add('success-step');
    stepsItemSecond.classList.add('active-step');
    formBtn.textContent = 'Sign Up';
  });

}

function signUpFormData(form) {
  const request = new XMLHttpRequest();
  request.open('POST', '/api/signup');

  const formData = new FormData(form);
  request.send(formData);

  request.addEventListener('load', () => {
    if (request === 200) {
      console.log(request.response);
    }
  });
}

signUpForm();