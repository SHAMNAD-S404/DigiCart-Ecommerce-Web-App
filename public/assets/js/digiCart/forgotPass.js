//****************************************************************************************************************** */
//SENDING EMAIL TO SERVER

async function verifyEmail(){
    try {
        const email = document.getElementById('email').value
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {

            return Swal.fire({
                title: "failed",
                text: "Enter a valid Email !",
                icon: "warning"
            });
            
        }

        const response = await fetch('/forgotpassword',{
            method:'POST',
            headers:{"Content-Type":'application/json'},
            body:JSON.stringify({email})
        })

        if (response.redirected) {
            return window.location.href = response.url
        }

        const data = await response.json()

        if (data.success) {

            document.getElementById('firstDiv').style.display='none';
            document.getElementById('otpModal').style.display='flex';

            Swal.fire({
                title: "Success",
                text: data.success||"Success",
                icon: "success"
            });
            
        }else if(data.error){

            Swal.fire({
                title: "Failed",
                text: data.error||"Failed",
                icon: "error"
            });
        }




    } catch (error) {
        console.error(error);
    }
 }

//****************************************************************************************************************** */
//?OTP VERIFICATION INPUT BOX AUTO MOVE FUNCTION 

function moveToNext(input,index) {
    const inputs=document.getElementsByClassName('otp-input');
    if(input.value.length&&index<inputs.length-1) {
        inputs[index+1].focus();
    } else if(input.value.length===0&&index>0) {
        inputs[index-1].focus();
    }
}


//****************************************************************************************************************** */
//? OTP VERIFICATION

 async function verifyOtp() {
    const inputs=document.getElementsByClassName('otp-input');
    let otp='';
    for(let input of inputs) {
        otp+=input.value;
    }
    if(otp.length===6) {

        const response = await fetch('/reset-password',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({otp})
        })

            if (response.redirected) {
                return window.location.href = response.url
            }

            const data = await response.json()

                if (data.error) {
                    
                    Swal.fire({
                        title: "Failed",
                        text: data.error||"Failed",
                        icon: "error"
                    });            
                } else if (data.success) {

                    Swal.fire({
                        title: "Success",
                        text: data.success||"Success",
                        icon: "success"
                    }).then(()=>{
                        return window.location.href= '/reset-password'
                    });
                }
        

        
    } else {

        Swal.fire({
            title: "Failed",
            text: "Please enter a 6-digit OTP",
            icon: "warning"
        });
    }
}



//****************************************************************************************************************** */