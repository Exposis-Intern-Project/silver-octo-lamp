
let count_elem = document.getElementById("countdown_time-off");

var count = 15;

setInterval(() => {
    if(count > 0){
        count--;
        count_elem.textContent = count;
        // console.log(count)
    }
    else{
        window.location.href= "/";
    }
    
}, 1000);