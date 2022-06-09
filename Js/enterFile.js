
var fileInput = document.getElementById("input-20");
var valid_email = [];
var invalid_email = [];

var valid_field = document.getElementById("textAreaExample1");
var Invalid_field = document.getElementById("textAreaExample2");



const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

const fill_Array = (email)=>{
    if(validateEmail(email)) {
        valid_email.push(email);
    }
    else{
        invalid_email.push(email);
    }
}

const readFile = async()=>{
    let wholeData = await fileInput.files[0].text();
    let arr = wholeData.split(/\r\n/);
    arr.shift(); // removing first line from csv file 
    // i.e Placemenet Emails
    
    
    // filling  valid & invalid array

    arr.map(fill_Array);
     valid_email.sort();
     invalid_email.sort();
     fill_Data();
      
     
     /// validate database
      localStorage.setItem("valid_emails" , JSON.stringify(valid_email)) 
      localStorage.setItem("Invalid_emails" , JSON.stringify(invalid_email));

 }

fileInput.addEventListener('change', readFile);

const fill_Data = () =>{
  for (let index = 0; index < valid_email.length; index++) {
    valid_field.value = valid_field.value + "\n" +  (index+1) + ".  " +  valid_email[index];

  }
  for (let index = 0; index < invalid_email.length; index++) {
      Invalid_field.value = Invalid_field.value + "\n" +  (index+1) + ".  " +  invalid_email[index];  
     }
  }
//  valid_email.focus();



