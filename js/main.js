document.addEventListener('DOMContentLoaded', () => {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      if (form.classList.contains('sign-up__form')) {
        signUpForm();
      } else {
        form.addEventListener('submit', (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        }, false);
      }
    });

  const resendBtn = document.querySelector('.resend-email__link');
  const cancelBtn = document.querySelector('.recovery-modal__btn--cancel');
  const forgotBtn = document.querySelector('.recovery-modal__btn--passw-forgot');
  const secondsBox = document.querySelector('.resend-email__sec');


  recoveryForm();
  passwordRecoveryForm();
  closeRecoveryForm();
  sendEmailAgain();
  enableBtns();
  togglePasswordVisibility();


  function signUpForm() {
    const form = document.querySelector('.sign-up__form');
    const formEmail = form.querySelector('.sign-up__input--email');
    const firstName = form.querySelector('.sign-up__input--first-name');
    const lastName = form.querySelector('.sign-up__input--last-name');
    const newPassw = form.querySelector('input[name="password"');
    const confPassw = form.querySelector('input[name="confirm_password"');
    const formBtn = document.querySelector('.sign-up__btn');
    const stepsItemFirst = document.querySelector('.sign-up-steps__item--first');
    const stepsItemSecond = document.querySelector('.sign-up-steps__item--second');

    formBtn.addEventListener('click', e => {
      if (!formEmail.checkValidity() || !firstName.checkValidity() || !lastName.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }

      form.classList.add('was-validated');

      if (formEmail.checkValidity() && firstName.checkValidity() && lastName.checkValidity()) {
        e.preventDefault();
        form.classList.add('first-step-success');
        stepsItemFirst.classList.remove('active-step');
        stepsItemFirst.classList.add('success-step');
        stepsItemSecond.classList.add('active-step');

        formBtn.textContent = 'Sign Up';
        formBtn.setAttribute("disabled", null);
        form.classList.remove('was-validated');

        formBtn.addEventListener('click', e => {
          e.preventDefault();
          formBtn.removeAttribute('disabled');
          form.classList.add('was-validated');

          if (!validatePassword(form, newPassw, confPassw)) {
            e.preventDefault();
            e.stopPropagation();
          } else {
            form.requestSubmit();
          }
        });
      }

    });
  }

  function passwordRecoveryForm() {
    const form = document.querySelector('.passw-recovery__form');
    const newPassw = form.querySelector('input[name="new_password"');
    const confPassw = form.querySelector('input[name="confirm_new_password"');

    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!validatePassword(form, newPassw, confPassw)) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        form.submit();
      }
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

  function validatePassword(form, newPassword, confirmPassword) {
    const passwLengthMsg = form.querySelector('.password-rools__item--length');
    const passwIsNumericMsg = form.querySelector('.password-rools__item--numeric');

    if (checkPasswordLength(newPassword, passwLengthMsg) &&
      checkPasswordLength(confirmPassword, passwLengthMsg) &&
      isNaN(+newPassword.value) && newPassword.value === confirmPassword.value) {
      return true;
    }

    if (checkPasswordLength(newPassword, passwLengthMsg) && checkPasswordLength(confirmPassword, passwLengthMsg)) {
      passwLengthMsg.classList.remove('error');
    }
    if (isNaN(+newPassword.value)) {
      passwIsNumericMsg.classList.remove('error');
    }

    if (!isNaN(+newPassword.value)) {
      newPassword.setCustomValidity('Your password can\'t be entirely numeric');
      passwIsNumericMsg.classList.add('error');
    } else {
      passwIsNumericMsg.classList.remove('error');
      newPassword.setCustomValidity('');
    }

    if (newPassword.value !== confirmPassword.value) {
      newPassword.setCustomValidity("Invalid field.");
      confirmPassword.setCustomValidity("Invalid field.");
    } else {
      newPassword.setCustomValidity("");
      confirmPassword.setCustomValidity("");
    }
  }

  function checkPasswordLength(input, message) {
    if (input.value.length < 8) {
      input.setCustomValidity("Password must be atleast 8 characters.");
      message.classList.add('error');
      return false;
    } else {
      input.setCustomValidity("");
      return true;
    }
  }

  function recoveryForm() {
    const recoveryForm = document.querySelector('.recovery-modal__form');

    recoveryForm.addEventListener('submit', event => {
      if (!recoveryForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        recoveryForm.classList.add('resend');
        activateResendBtn();
        cancelBtn.textContent = 'Okay, thank!';
      }
    });
  }

  function closeRecoveryForm(id) {
    const recoveryForm = document.querySelector('.recovery-modal__form');

    cancelBtn.addEventListener('click', () => {
      recoveryForm.classList.remove('resend');
      recoveryForm.reset();
      recoveryForm.classList.remove('was-validated');
      clearInterval(id);
      cancelBtn.textContent = 'Cancel';
      forgotBtn.setAttribute('disabled', null);
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

  function enableBtn(form) {
    const inputs = form.querySelectorAll('input');
    const formBtn = form.querySelector('button');

    inputs.forEach(input => {
      input.addEventListener('keyup', () => {
        const inputValue = input.value;

        if (inputValue != '') {
          formBtn.removeAttribute('disabled');
        } else {
          formBtn.setAttribute('disabled', null);
        }
      });
    });
  }

  function enableBtns() {
    const logInForm = document.querySelector('.login');
    const signUpForm = document.querySelector('.sign-up');
    const recoveryModalForm = document.querySelector('.recovery-modal__form');
    const passwRecoveryForm = document.querySelector('.passw-recovery__form');

    enableBtn(logInForm);
    enableBtn(signUpForm);
    enableBtn(recoveryModalForm);
    enableBtn(passwRecoveryForm);
  }

  function togglePasswordVisibility() {
    const toggleBtns = document.querySelectorAll('.toggle-password__btn');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('show');
        if (btn.previousElementSibling.type === 'password') {
          btn.previousElementSibling.type = "text";
        } else {
          btn.previousElementSibling.type = "password";
        }
      });
    });
  }

  // function mask(dataValue, options) {
  //   const elements = document.querySelectorAll(`[data-mask="${dataValue}"]`);
  //   if (!elements) return;

  //   elements.forEach((el) => {
  //     IMask(el, options)
  //       .on("accept", function () {
  //         el.classList.add("error");
  //       })
  //       .on("complete", function () {
  //         el.classList.remove("error");
  //       });
  //   });
  // }

  //Mask for email
  // mask("email", {
  //   mask: /^\S*@?\S*$/,
  // });
});