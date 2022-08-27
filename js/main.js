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
  changePassword();
  sendEmailAgain();
  enableBtns();
  togglePasswordVisibility();
  customSelect();


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

  function changePassword() {
    const form = document.querySelector('.password-form');
    const formOldPassword = form.querySelector('.password-form__input--old-passw');
    const formNewPassword = form.querySelector('.password-form__input--new-passw');
    const formConfirmPassword = form.querySelector('.password-form__input--conf-passw');


    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validatePassword(form, formNewPassword, formConfirmPassword, formOldPassword)) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        form.submit();
      }
    });
  }


  function validatePassword(form, newPassword, confirmPassword, oldPassword = 'empty') {
    const passwLengthMsg = form.querySelector('.password-rools__item--length');
    const passwIsNumericMsg = form.querySelector('.password-rools__item--numeric');
    const confPasswInvalidMsg = form.querySelector('.password-form__input--conf-passw .invalid-feedback');
    const newPasswInput = form.querySelector('.auth-modal__row--new-passw input');
    const newPasswInvalidMsg = form.querySelector('.auth-modal__row--new-passw .invalid-feedback');

    if (oldPassword !== 'empty') {
      if (checkPasswordLength(oldPassword, passwLengthMsg) &&
          checkPasswordLength(newPassword, passwLengthMsg) &&
          checkPasswordLength(confirmPassword, passwLengthMsg) &&
          isNaN(+oldPassword.value) && isNaN(+newPassword.value) &&
          oldPassword.value !== newPassword.value && 
          oldPassword.value !== confirmPassword.value && 
          newPassword.value === confirmPassword.value) {
        return true;
      }

      if (checkPasswordLength(oldPassword, passwLengthMsg) && 
          checkPasswordLength(newPassword, passwLengthMsg) && 
          checkPasswordLength(confirmPassword, passwLengthMsg)) {
        passwLengthMsg.classList.remove('error');
      }
      if (isNaN(+oldPassword.value) || isNaN(+newPassword.value)) {
        passwIsNumericMsg.classList.remove('error');
      }

      if (!isNaN(+newPassword.value)) {
        newPassword.setCustomValidity('Your password can\'t be entirely numeric');
        passwIsNumericMsg.classList.add('error');
      } else {
        passwIsNumericMsg.classList.remove('error');
        newPassword.setCustomValidity('');
      }

      
      if (newPassword.value === oldPassword.value || newPassword.value !== confirmPassword.value) {
        newPassword.setCustomValidity("Invalid field");
        confirmPassword.setCustomValidity("Invalid field");
        newPasswInput.classList.add('auth-modal__input--message');
        newPasswInvalidMsg.textContent = "The New Password must not be the same as the Old Password";
      } else if (newPassword.value === "") {
        newPassword.setCustomValidity("Invalid field");
        newPasswInvalidMsg.textContent = "The field cannot be empty";
      } else if (confirmPassword.value === "") {
        confirmPassword.setCustomValidity("Invalid field");
        confPasswInvalidMsg.textContent = "The field cannot be empty";
      }else {
        newPassword.setCustomValidity("");
        confirmPassword.setCustomValidity("");
      }
     

      if (newPassword.value !== confirmPassword.value) {
        newPassword.setCustomValidity("Invalid field.");
        newPassword.classList.remove('auth-modal__input--message');
        newPasswInvalidMsg.style.display = "none";
        confirmPassword.setCustomValidity("Invalid field.");
      } else {
        newPassword.setCustomValidity("");
        confirmPassword.setCustomValidity("");
      }

      if (newPassword.value === oldPassword.value && newPassword.value === confirmPassword.value) {
        newPassword.setCustomValidity("Invalid field");
        if (confPasswInvalidMsg) {
          confPasswInvalidMsg.style.display = "none";
        }
        newPasswInput.classList.add('auth-modal__input--message');

        newPasswInvalidMsg.style.display = "block";
        newPasswInvalidMsg.textContent = "The New Password must not be the same as the Old Password";
      } else {
        if (confPasswInvalidMsg) {
          confPasswInvalidMsg.style.display = "block";
        }
        newPasswInput.classList.remove('auth-modal__input--message');
      }
    } else {
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
    const profileForm = document.querySelector('.profile-form');
    const addressForm = document.querySelector('.address-form');
    const passwordForm = document.querySelector('.password-form');

    enableBtn(logInForm);
    enableBtn(signUpForm);
    enableBtn(recoveryModalForm);
    enableBtn(passwRecoveryForm);
    enableBtn(profileForm);
    enableBtn(addressForm);
    enableBtn(passwordForm);
  }

  function togglePasswordVisibility() {
    const toggleBtns = document.querySelectorAll('.toggle-password__btn ');

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

  function customSelect() {
    let x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");

    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];

      ll = selElmnt.length;
      /* For each element, create a new DIV that will act as the selected item: */
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /* For each element, create a new DIV that will contain the option list: */
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        // Activate form button if opene custom select
        const itemsBoxes = document.querySelectorAll('.select-selected');
        const addressForm = document.querySelector('.address-form');
        const addrFormBtn = addressForm.querySelector('.address-form__submit');

        itemsBoxes.forEach(box => {
          box.addEventListener('click', e => {
            if (e.target.classList.contains('select-arrow-active')) {
              addrFormBtn.removeAttribute('disabled');
            }
          });
        });
        c.addEventListener("click", function (e) {
          /* When an item is clicked, update the original select box,
          and the selected item: */
          let y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }

    function closeAllSelect(elmnt) {
      /* A function that will close all select boxes in the document,
      except the current select box: */
      let x, y, i, xl, yl, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
  }

  $(function () {
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      container: '.picker-container',
      templates: {
        leftArrow: '<div class="datepicker-btn datepicker-btn--prev"><svg class="datepicker-btn__icon"><use xlink:href="#datepicker-left-arrow"></svg></div>',
        rightArrow: '<div class="datepicker-btn datepicker-btn--next"><svg class="datepicker-btn__icon"><use xlink:href="#datepicker-right-arrow"></svg></div>'
      }
    });
  });

  function breadcrumb() {
    const breadcrumbBox = document.querySelector('.breadcrumb');
    const breadcrumbNavLinks = document.querySelectorAll('.breadcrumb-nav-link');
    breadcrumbBox.append(createBreadcrumb("Home"));

    let breadcrumbItems = breadcrumbBox.querySelectorAll('.breadcrumb-item');
    const breadcrumbArr = [];

    breadcrumbItems.forEach(item => {
      breadcrumbArr.push(item);
    });

    breadcrumbBox.firstElementChild.classList.add('active');
    
    breadcrumbNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        breadcrumbItems = breadcrumbBox.querySelectorAll('.breadcrumb-item');
        let condition = breadcrumbArr.some(item => {
          return link.textContent === item.textContent;
        });
        if(!condition) {
          breadcrumbArr.push(createBreadcrumb(link.textContent));
        }
        breadcrumbArr.forEach((item, index)=> {
          if (link.textContent === item.textContent) {
            breadcrumbArr.splice(++index);
          }
          if (item.textContent === "Profile" && link.textContent === "Consultation" || 
              item.textContent === "Consultation" && link.textContent === "Profile" || 
              item.textContent === "Profile" && link.textContent === "Documents" || 
              item.textContent === "Documents" && link.textContent === "Profile" || 
              item.textContent === "Documents" && link.textContent === "Consultation" || 
              item.textContent === "Consultation" && link.textContent === "Documents" || 
              item.textContent === "Documents" && link.textContent === "Treatment Plan" || 
              item.textContent === "Treatment Plan" && link.textContent === "Documents" || 
              item.textContent === "Consultation" && link.textContent === "Treatment Plan" || 
              item.textContent === "Treatment Plan" && link.textContent === "Consultation" || 
              item.textContent === "Treatment Plan" && link.textContent === "Profile" ||
              item.textContent === "Profile" && link.textContent === "Treatment Plan" || 
              item.textContent === "Address" && link.textContent === "Password" ||
              item.textContent === "Password" && link.textContent === "Address") {
            breadcrumbArr.splice(index);
            breadcrumbArr.push(createBreadcrumb(link.textContent));
          }
        });
        breadcrumbBox.innerHTML = "";

        breadcrumbArr.forEach(item => {
          breadcrumbBox.append(item);
          item.classList.remove('active');
        });
        breadcrumbBox.lastElementChild.classList.add('active');
      });
    });
  }

  breadcrumb();

  function createBreadcrumb(value) {
    const li = document.createElement('li');
    li.classList.add('breadcrumb-item');
    li.innerHTML = `<a>${value}</a>`;
    return li;
  }

  // inputmask
  function mask(dataValue, options) {
		const elements = document.querySelectorAll(`[data-mask="${dataValue}"]`);
		if (!elements) return;

		// if (dataValue === "postal_code") {
		// 	elements.forEach((el) => {
		// 		IMask(el, options).on("accept", function () {
		// 			el.classList.add("error");
		// 			el.previousElementSibling.classList.add("show");
		// 			if (el.value.length === 6) {
		// 				el.classList.remove("error");
		// 				el.previousElementSibling.classList.remove("show");
		// 			}
		// 		});
		// 	});
		// } else {
    // }
    elements.forEach((el) => {
      IMask(el, options)
        .on("accept", function () {
          // el.classList.add("error");
          el.setCustomValidity("Invalid field");
        })
        .on("complete", function () {
          // el.classList.remove("error");
          el.setCustomValidity("");
        });
    });
  }

  //Mask for phone
  mask("phone", {
		mask: "+{6} 000 000 000",
	});
  //Mask for age
  mask("age", {
    mask: Date,
    autofix: true,
    blocks: {
      d: {mask: IMask.MaskedRange, placeholderChar: 'd', from: 1, to: 31, maxLength: 2},
      m: {mask: IMask.MaskedRange, placeholderChar: 'm', from: 1, to: 12, maxLength: 2},
      Y: {mask: IMask.MaskedRange, placeholderChar: 'y', from: 1930, to: 2004, maxLength: 4}
    }
  });
  //Mask for bio
  mask("latin", {
    mask: /^[a-zA-Z-\s]{0,44}$/,
  });
  //Mask for email
  mask("email", {
    mask: /^[0-9a-z@.-_\s]{0,44}$/,
  });
  //Mask for address
	mask("address", {
		mask: /^[0-9a-zA-Z-\s]{0,44}$/,
	});
  //Mask for postcode
  mask("postal_code", {
		mask: "000000",
	});
});