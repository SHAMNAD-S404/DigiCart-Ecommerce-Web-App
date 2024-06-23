async function ResetPassword(userID) {
    const newPassword=document.getElementById('newPassword').value;
    const confirmPassword=document.getElementById('confirmPassword').value;
    const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if(newPassword!==confirmPassword) {

        return Swal.fire({
            title: "Failed",
            text: "Password Not Matching !",
            icon: "warning"
        }); 

    }else if(!passwordRegex.test(newPassword)){

        return Swal.fire({
            title: "Validation Failed",
            text: " Enter a Valid Password !",
            icon: "warning"
        });
    }else {

        const response = await fetch('/reset-password',{
            method :'PATCH',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({userID,newPassword})
        })

        if (response.redirected) {
            return window.location.href = response.url
        }

        const data = await response.json()

        if (data.success) {

             Swal.fire({
                title: "Success",
                text: data.success||"Success !",
                icon: "success"

            }).then(() => {
                return window.location.href = '/login';
            });
            
        }else if(data.error){

            return Swal.fire({
                title: "Failed",
                text: data.error||"Failed !",
                icon: "error"
            });

        }
        
    }

   
}
