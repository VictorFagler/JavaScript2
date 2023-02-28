const BASE_URL = 'https://fnd22-shared.azurewebsites.net/swagger/index.html';
const CASE_URL = 'https://fnd22-shared.azurewebsites.net/api/Cases';
const message = document.querySelector('#messageInput');
const subject = document.querySelector('#subjectInput');
const email = document.querySelector('#emailInput');
const form = document.querySelector('#taskForm');
const containter = document.querySelector('.caseContainer');
const cases = [];


let newPost = {};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  newPost = {
    email: email.value,
    subject: subject.value,
    message: message.value,
  };
  postCase();
  form.reset()
});

const postCase = () => {
  return fetch(CASE_URL, {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      cases.unshift({ ...newPost, id: data });
      caseList(newPost.subject, newPost.email, newPost.message, 'New');
    })
    .catch((err) => console.log(err));
};

const getCase = () => {
  return fetch(CASE_URL)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        cases.push(element);
      });
      cases.forEach((element) => {
        caseList(
          element.subject,
          element.email,
          element.message,
          element.created
        );
        cases.sort(function (a, b) {
          if (a.created < b.created) {
            return -1;
          }
          if (a.created > b.created) {
            return 1;
          }
        });
      });
    });
};
const caseList = (subject, email, message, time) => {
  containter.innerHTML =
    `<div class="user">
        <span class="timeAdd">${time.replace('T', ' ').substring(0, 16)}</span>
        <p class="userSubject">${subject}</p>
        <p class="userEmail">${email}</p>
        <p class="userMessage">${message}</p>
        <button class="showModal">Add comment</button>
        </div>`+ containter.innerHTML;

  //MODAL
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.closeModal');
  const btnOpenModal = document.querySelector('.showModal');

  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  btnCloseModal.addEventListener('click', closeModal);
  btnOpenModal.addEventListener('click', openModal);
  overlay.addEventListener('click', closeModal);
};

getCase();

