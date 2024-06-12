 //document.getElementById('otpForm').addEventListener('submit',function (event) {
//    event.preventDefault();
//    // Add your OTP verification logic here
//});





// RESEND OTP FUNCTION 

document.addEventListener('DOMContentLoaded',() => {
    const resendButton=document.getElementById('resendOTP');
    const timerElement=document.getElementById('timer');

    const showResendButton=() => {
        resendButton.style.display='block';
        timerElement.style.display='none';
    };

    const startTimer=(duration) => {
        let timer=duration;
        const intervalId=setInterval(() => {
            timerElement.textContent=`did't get otp ? please wait for : ${Math.floor(timer/60)}:${timer%60<10? '0':''}${timer%60}`;
            timer--;

            if(timer<0) {
                clearInterval(intervalId);
                showResendButton();
            }
        },1000);
    };

    // Initially hide the resend button and show the timer
    resendButton.style.display='none';
    timerElement.style.display='block';

    // Start the timer for 2 minutes (120 seconds)
    startTimer(120);
});


