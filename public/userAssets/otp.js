//*************************************************************************************************************** */

// JavaScript to automatically move cursor to the next input field
document.addEventListener('DOMContentLoaded',() => {
    const inputs=document.querySelectorAll('.otp-inputs input');

    inputs.forEach((input,index) => {
        input.addEventListener('input',() => {
            if(input.value.length===1&&index<inputs.length-1) {
                inputs[index+1].focus();
            }
        });

        input.addEventListener('keydown',(event) => {
            if(event.key==='Backspace'&&input.value.length===0&&index>0) {
                inputs[index-1].focus();
            }
        });
    });
});

//*************************************************************************************************************** */

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

//*************************************************************************************************************** */
