function validateForm() {
   
    const nameRegex=/^[^\s][a-zA-Z\s]*[^\s]$/;
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex=/^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/;
    //const passwordRegex=/^(?=.[a-zA-Z])(?=.\d)[a-zA-Z\d]{6,}$/;
    const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

   
    

    const name=document.getElementById('username').value;
    const email=document.getElementById('email-id').value;
    const phone=document.getElementById('phone').value;
    const password=document.getElementById('password').value
    const confirmPassword=document.getElementById('confirmPassword').value

    let isValid = true;

    if(!nameRegex.test(name)){
        displayError('name-error','Please enter a valid name (First Name and Last Name).No white space allowed');
        isValid = false;
    }else{
        hideError('name-error');
    }

    if(!emailRegex.test(email)){
        displayError('email-error','Please enter a valid email address')
        isValid = false
    }else{
        hideError('email-error')
    }

    if(!phoneRegex.test(phone)) {
        displayError('phone-error','Please enter a valid 10-digit phone number');
        isValid=false;
    } else {
        hideError('phone-error');
    }

    if(!passwordRegex.test(password)) {
        displayError('password-error','Password must be at least 6 characters long and contain at least one digit, one lowercase letter, and one uppercase letter');
        isValid=false;
    } else {
        hideError('password-error');
    }

    if(password!==confirmPassword) {
        displayError('confirmPassword-error','Passwords do not match');
        isValid=false;
    } else {
        hideError('confirmPassword-error');
    }

    return isValid ;
}


function displayError(id,message) {
    const errorElement=document.getElementById(id);
    if(errorElement) {
        errorElement.textContent=message;
        errorElement.style.display='block';
    }
}

function hideError(id) {
    const errorElement=document.getElementById(id);
    if(errorElement) {
        errorElement.textContent='';
        errorElement.style.display='none';
    }
}