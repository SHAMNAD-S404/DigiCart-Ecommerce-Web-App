//************************************************************************************************************************** */
//USER PROFILE UPDATION ONLOAD

document.getElementById('userButton').addEventListener('click',async()=>{
    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const gender = document.getElementById('gender').value;

    try {
        
        const response = await fetch('/update-user',{
            method:'PATCH',
            headers:{'Content-type':'application/json' },
            body:JSON.stringify({

                fullname:fullname,
                phone:phone,
                gender:gender 
            })
            
        })

        if(response.redirected) {
             return window.location.href=response.url;
            }

            const data = await response.json()
             if (data.success) {
                Swal.fire({
                icon: "success",
                title: "done",
                text: data.success || "Updated successfully",
                customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
               
                }).then(() => {
                    window.location.reload()
                })
            }else if(data.error){
                Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.error || "Something went wrong!",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
               
                });
            }


    } catch (error) {
             console.error(error);
             Swal.fire({
             icon: "error",
             title: "Oops...",
             text: "Something went wrong!",
                 customClass: {
                     popup: 'swal2-popup-custom-font-size'
                 }
               
            });
        
    }

})

//************************************************************************************************************************** */
// USER  PASSWORD UPDATION

    document.getElementById('changePassButton').addEventListener('click',async()=>{

        const currentPassword = document.getElementById('currentPass').value;
        const newPassword     = document.getElementById('newPass').value;
        const confirmPassword = document.getElementById('confirmPass').value;

        try {

            const response = await fetch('/change-password',{
                method:'PATCH',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({

                    currentPass :currentPassword,
                    newPass : newPassword,
                    confirmPass : confirmPassword
                })
            })

            if(response.redirected) {
                return window.location.href=response.url;
            }

            const data = await response.json()
             if (data.success) {
                Swal.fire({
                icon: "success",
                title: "done",
                text: data.success || "Updated successfully",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
                
               
               
                }).then(()=>{
                     window.location.href = '/logout'
                })
             }else if(data.error){
                 Swal.fire({
                icon: "error",
                title: "Oops...",               
                text: data.error || "Something went wrong!",
                     customClass: {
                         popup: 'swal2-popup-custom-font-size'
                     }
                     
                });
             }
            
        } catch (error) {
            console.error(error);
            Swal.fire({
             icon: "error",
             title: "Oops...",
             text: "Something went wrong!",
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }
            });
        }

    })

//************************************************************************************************************************** */
// USER ADDRESS VALIDATION AND API CALLS    

document.getElementById('insertAddress').addEventListener('click',async()=>{

    try {

        
        const fullname=document.getElementById('nameAddress').value.trim();
        const phoneNumber=document.getElementById('userphone').value.trim();
        const userAddress=document.getElementById('useraddress').value.trim();
        const userLocality=document.getElementById('userLocality').value.trim();
        const landmark=document.getElementById('userLandmark').value.trim();
        const city=document.getElementById('userCity').value.trim();
        const state=document.getElementById('userState').value.trim();
        const pincode=document.getElementById('userPincode').value.trim();
        const addressType=document.getElementById('addressType').value.trim();

        //REGX VALIDATION
        const nameRegex=/^[^\s][a-zA-Z\s]*[^\s]$/;
        const phoneRegex=/^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/;
        const addressRegex=/^[A-Za-z0-9.,' -]{5,}$/;
        const localityRegex=/^[A-Za-z ]{5,}$/;
        const landmarkRegex=/^[A-Za-z ]{5,}$/;
        const cityRegex=/^[A-Za-z ]{5,}$/;
        const stateRegex=/^[A-Za-z ]{5,}$/;
        const pincodeRegex=/^[0-9]{1,6}$/;

        let ok=true;

        if (!nameRegex.test(fullname)|| fullname.length < 4) {
            document.getElementById('nameError').textContent = "Enter valid name, min length 4 ! " ;
            ok=false;
        }else{
            document.getElementById('nameError').textContent = '';
        }

        if (!phoneRegex.test(phoneNumber)) {
            document.getElementById('phoneError').textContent = "Enter valid Phone number ! " ;
            ok=false;
        }else{
            document.getElementById('phoneError').textContent = '';
        }

        if (!addressRegex.test(userAddress) ) {
            document.getElementById('addressError').textContent = "Enter valid address ! " ;
            ok=false;
        }else{
            document.getElementById('addressError').textContent = '';
        }

        if (!localityRegex.test(userLocality) ) {
            document.getElementById('localityError').textContent = "Enter valid Locality  ! " ;
            ok=false;
        }else{
            document.getElementById('localityError').textContent = '';
        }

        if (!landmarkRegex.test(landmark) ) {
            document.getElementById('landmarkError').textContent = "Enter valid Landmark ! " ;
            ok=false;
        }else{
            document.getElementById('landmarkError').textContent = '';
        }

        if (!cityRegex.test(city) ) {
            document.getElementById('cityError').textContent = "Enter valid city ! " ;
            ok=false;
        }else{
            document.getElementById('cityError').textContent = '';
        }

        if (!stateRegex.test(state)) {
            document.getElementById('stateError').textContent = "Enter valid State name ! " ;
            ok=false;
        }else{
            document.getElementById('stateError').textContent = '';
        }

        if (!pincodeRegex.test(pincode)|| pincode.length < 6) {
            document.getElementById('pincodeError').textContent = "Enter valid pincode  length 6 ! " ;
            ok=false;
        }else{
            document.getElementById('pincodeError').textContent = '';
        }

        if (ok) {
            
            //modalAction('.submit');
            document.getElementById('IamCloseButton').click();

        const response = await fetch('/add-address',{
            method:'POST',
            headers:{'Content-type': 'application/json'},
            body : JSON.stringify({

                fullname : fullname,
                phone    : phoneNumber,
                address  : userAddress,
                locality : userLocality,
                landmark : landmark,
                city     : city,
                state    : state,
                pincode  : pincode,
                addressType : addressType


            })
        })

        if(response.redirected) {
                return window.location.href=response.url;
            }

        const data = await response.json()
        if(data.success) {
            Swal.fire({
            icon: "success",
            title: "done",
            text: data.success||"Updated successfully",
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }

            }).then(()=>{
                window.location.reload()
                //window.location.href= '/user-profile#v-pills-address';      
                 
            })
           
        }else if(data.error){
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.error || "Something went wrong!",
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }
               
                });
             }

        }     
        
    } catch (error) {
        console.error(error);
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }
     });
    }

})

//************************************************************************************************************************** */
//Delete address
async function deleteAddress(divID,queryID){

    try {
        const swalWithBootstrapButtons=Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            //title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }

        }).then(async(result)=>{
            if (result.isConfirmed) {

                const response = await fetch('/delete-address',{
                    method:'PATCH',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        addressID : queryID   
                    })

                })

            if(response.redirected) {
                    return window.location.href=response.url;
                }    

                const data = await response.json();
                if (data.success) {
                    document.getElementById(divID).style.display = 'none';
                    Swal.fire({
                        icon: "success",
                        title: "Deleted",
                        text: data.success||"Deleted successfully",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }

                    })
                }else if(data.error){
                    Swal.fire({
                        icon: "error",
                        title: "failed...",
                        text: data.error||"Something went wrong!",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }

                    });
                }
               
            }else{
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your file not deleted :)",
                    icon: "error",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
                });
            }
        })

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }
        });
    }

}

//************************************************************************************************************************** */
//UPDATE USER ADDRESS

async function editAddress(addressID){
    try {

        const mybutton = document.getElementById('submitButton'+addressID)

        mybutton.addEventListener('click',async () => {

        const fullname=document.getElementById('inputName'+addressID).value;
        console.log(fullname);
        const phoneNumber=document.getElementById('inputPhone'+addressID).value.trim();
        const userAddress=document.getElementById('inputAddress'+addressID).value.trim();
        const userLocality=document.getElementById('inputLocality'+addressID).value.trim();
        const landmark=document.getElementById('inputLandmark'+addressID).value.trim();
        const city=document.getElementById('inputCity'+addressID).value.trim();
        const state=document.getElementById('inputState'+addressID).value.trim();
        const pincode=document.getElementById('inputZip'+addressID).value.trim();
        const addressType=document.getElementById('inputAddressType'+addressID).value.trim();

        //REGX VALIDATION
        const nameRegex=/^[^\s][a-zA-Z\s]*[^\s]$/;
        const phoneRegex=/^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/;
        const addressRegex=/^[A-Za-z0-9.,' -]{5,}$/;
        const localityRegex=/^[A-Za-z ]{5,}$/;
        const landmarkRegex=/^[A-Za-z ]{5,}$/;
        const cityRegex=/^[A-Za-z ]{5,}$/;
        const stateRegex=/^[A-Za-z ]{5,}$/;
        const pincodeRegex=/^[0-9]{1,6}$/;

        let ok = true;
        if(!nameRegex.test(fullname)||fullname.length<4) {
            document.getElementById('nameErrors'+addressID).textContent="Enter valid name, min length 4 ! ";
            ok=false;
        } else {
            document.getElementById('nameErrors'+addressID).textContent='';
        }

        if(!phoneRegex.test(phoneNumber)) {
            document.getElementById('phoneErrors'+addressID).textContent="Enter valid Phone number ! ";
            ok=false;
        } else {
            document.getElementById('phoneErrors'+addressID).textContent='';
        }

        if(!addressRegex.test(userAddress)) {
            document.getElementById('addressErrors'+addressID).textContent="Enter valid address ! ";
            ok=false;
        } else {
            document.getElementById('addressErrors'+addressID).textContent='';
        }

        if(!localityRegex.test(userLocality)) {
            document.getElementById('localityErrors').textContent="Enter valid Locality  ! ";
            ok=false;
        } else {
            document.getElementById('localityErrors'+addressID).textContent='';
        }

        if(!landmarkRegex.test(landmark)) {
            document.getElementById('landmarkErrors'+addressID).textContent="Enter valid Landmark ! ";
            ok=false;
        } else {
            document.getElementById('landmarkErrors'+addressID).textContent='';
        }

        if(!cityRegex.test(city)) {
            document.getElementById('cityErrors'+addressID).textContent="Enter valid city ! ";
            ok=false;
        } else {
            document.getElementById('cityErrors'+addressID).textContent='';
        }

        if(!stateRegex.test(state)) {
            document.getElementById('stateErrors'+addressID).textContent="Enter valid State name ! ";
            ok=false;
        } else {
            document.getElementById('stateErrors'+addressID).textContent='';
        }

        if(!pincodeRegex.test(pincode)||pincode.length <6 ) {
            document.getElementById('pincodeErrors'+addressID).textContent="Enter valid pincode  length 6 ! ";
            ok=false;
        } else {
            document.getElementById('pincodeErrors'+addressID).textContent='';
        }
       
        if (ok) {
           
            document.getElementById('closeButton'+addressID).click();
                const response=await fetch('/edit-address',{
                method : 'PATCH',
                headers : {'Content-Type':'application/json'},
                body  :JSON.stringify({
                    fullname: fullname,
                    phone: phoneNumber,
                    address: userAddress,
                    locality: userLocality,
                    landmark: landmark,
                    city: city,
                    state: state,
                    pincode: pincode,
                    addressType: addressType,
                    addressID : addressID
                })  
                
            })

        if(response.redirected) {
                return window.location.href=response.url;
            }    

            const data=await response.json()
            if(data.success) {
                    Swal.fire({
                    icon: "success",
                    title: "done",
                    text: data.success||"Updated successfully",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }

                }).then(() => {
                    window.location.reload()
                })
            } else if(data.error) {
                    Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.error||"Something went wrong!",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }

                });
            }
            
        }
    })
        
    } catch (error) {
        
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        });
    }
}




/************************************************************************************************************************* */
//USER PROFILE UPDATION ONLOAD

  
document.addEventListener('DOMContentLoaded',async () => {
    try {
        

        //WISHLIST UPDATION ONLOAD

        document.querySelectorAll('.wlStock').forEach(element =>{
            const stock = parseInt(element.dataset.wlstock);
            const variantID=element.dataset.wlvariantid;
            const block = element.dataset.wlblock == 'true';
            const cartButton = document.getElementById('wlCartBtn'+variantID)
            const alertTag=document.getElementById('wlStock'+variantID)

            if (stock > 5 ) {
                alertTag.textContent = 'IN STOCK'
                alertTag.style.color = 'green'
                
            }else if (stock > 0 && stock <=5) {
                alertTag.textContent='FEW STOCK LEFT'
                alertTag.style.color='#eb6e34'
                
            }else{
                alertTag.textContent='OUT OF  STOCK'
                alertTag.style.color='red'
                cartButton.disabled = true
            }

            if (block) {
                alertTag.textContent='PRODUCT UNAVILABLE'
                alertTag.style.color='#1b42de'
                cartButton.disabled=true
            }


        })



    } catch(error) {
        console.error(error);
    }
});



/************************************************************************************************************************** */
 

//ADD TO CART FUNCTION

async function addToCart(variantID) {
    try {

        const response=await fetch('/add-cart',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                variantID
            })

        })

        if(response.redirected) {

            return window.location.href=response.url;

        }

        const data=await response.json()

        if(data.success) {

            //TO PLAY NOTIFICATION SOUND

            const audio=new Audio('/Audio/cart.mp3');
            audio.play();

            Swal.fire({
                icon: "success",
                text: data.success||"Updated successfully",
                footer: '<a href="/cart" style="color: #3085d6">Go to Cart</a>',
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }
            })
        } else if(data.error) {

            //TO PLAY NOTIFICATION SOUND

            const audio=new Audio('/Audio/serror.mp3');
            audio.play();

            Swal.fire({
                icon: "error",
                text: data.error||"Something went wrong!",
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }

            });
        }

    } catch(error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            text: "Something went wrong!",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }
        });
    }
}




/************************************************************************************************************************** */
//REMOVE WISHLIST ITEM 

    async function removeWishlistItem(variantID){
        try {

            Swal.fire({
                title: "Are you sure?",
                text: "You want to Remove this item ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Remove it!",
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }

            }).then(async (result) => {
                if(result.isConfirmed) {

                    const response = await fetch('/edit-wishlist',{
                        method:'PATCH',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({
                            variantId : variantID
                        })
                    })

                    if (response.redirected) {
                        return window.location.href=response.url;                       
                    }

                    const data = await response.json()

                    if (data.success) {

                        //TO PLAY NOTIFICATION SOUND

                        const audio=new Audio('/Audio/delete.mp3');
                        audio.play();

                        const tableRow = document.getElementById('wlRow'+variantID)
                        tableRow.style.display = 'none'

                        Swal.fire({
                            
                            text: data.success||"Your product removed from wishlist.",
                            icon: "success",
                            customClass: {
                                popup: 'swal2-popup-custom-font-size'
                            }
                        })
                        
                    }else if (data.error) {

                        Swal.fire({

                            text: data.error||"Something went wrong.",
                            icon: "error",
                            customClass: {
                                popup: 'swal2-popup-custom-font-size'
                            }
                        })
                        
                    }


                }
            })
            
        } catch (error) {
            console.log(error);
        }
    }



/************************************************************************************************************************** */
//* COPY REFFEREL CODE FUNCTION

function copyRefferelCode(){
    const code = document.getElementById('referrelCode').innerText

    navigator.clipboard.writeText(code)
        .then(() => alert('Referral code copied to clipboard!'))
        .catch(()=> alert('Failed to copy to clipboard!'))
        
}



/************************************************************************************************************************** */
//* GENERATE REFFERAL LINK

    async function generateReferralLink(){
        try {
            const response  = await fetch('/generate-referral',{
                method:'GET',
                headers:{'Content-Type':'application/json'}
            })

            if (response.redirected) {
                return window.location.href = response.url
            }

            const data = await response.json()

            if (data.success) {
                document.getElementById('generateReferral').style.display = 'none';
                appendReferralCode(data.referralCode);

                
            }else if(data.error){

                Swal.fire({
                    text: data.error||"failed",
                    icon: "error",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
                });
               
            }

            
        } catch (error) {
            console.error(error);
        }
    }

    function appendReferralCode(referralCode){
        const referralContainer = document.createElement('div');
        referralContainer.className= 'referral-container';
        referralContainer.innerHTML = `
         <div class="referral-header">Your Referral Code</div>
          <div class="referral-code" id="referrelCode">
          ${referralCode}
          </div>
         <p>Share this code with your friends and earn rewards!</p>
         <button class="btn btn-custom" onclick="copyReferralCode()">Copy Code</button>
        `;

        document.getElementById('mainDiv').appendChild(referralContainer)
        
        // Add event listener for the new button
        document.getElementById('copyCodeBtn').addEventListener('click',copyReferralCode);
    }


    //TO COPY THE CODE 
    
    function copyReferralCode(){
    const code = document.getElementById('referrelCode').innerText;

    navigator.clipboard.writeText(code)
        .then(() => alert('Referral code copied to clipboard!'))
        .catch(() => alert('Failed to copy to clipboard!'));
}


/************************************************************************************************************************** */
//* APPLY REFERRAL CODE

    async function applyReferralCode(){
        try {
            const referralCode = document.getElementById('inputReferralCode').value
            const regex = /^[A-Za-z0-9]{15}$/

            if (!regex.test(referralCode)) {
                return Swal.fire({
                    text: "Enter valid code !",
                    icon: "warning",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
                });
            }

            const response = await fetch('/verify-referral',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({referralCode})
            })

            if (response.redirected) {
                return window.location.href  = response.url
            }

            const data = await response.json()

            if (data.success) {
                Swal.fire({
                    title: "Success",
                    text: data.success,
                    icon: "success",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
                }).then(()=>{
                    return window.location.href= '/wallet'
                })

                
            }else if(data.error){

                Swal.fire({

                    text: data.error||"failed!",
                    icon: "error",
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    }
                });

            }


            
        } catch (error) {
            console.error(error);
        }
    }


/************************************************************************************************************************** */
