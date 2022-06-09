
const url = '';
const myForm = document.querySelector('#myForm');
const myName = document.querySelector('#name');
const myEmail = document.querySelector('#email');
const myMessage = document.querySelector('#message');
const myfile = document.querySelector('#myfile');
myForm.addEventListener('submit', submitter);
 function submitter(e) {
   console.log('submitted');
   e.preventDefault();
   let message = '';
   if (myName.value.length < 5) {
       myName.style.borderColor = 'red';
       message += `<br>Name needs to be 5 characters`;
   }
   if (myEmail.value.length < 5) {
       myEmail.style.borderColor = 'red';
       message += `<br>Email is missing`;
   }
   if (message) {
       const div = document.createElement('div');
       div.innerHTML = message;
       div.style.color = 'red';
       myForm.append(div);
       setTimeout(() => {
           div.remove();
           myName.style.borderColor = '';
           myEmail.style.borderColor = '';
       }, 5000);

       console.log(myObj);
   }
}