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

        
        const fullname=document.getElementById('nameAddress').value;
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


/****************************************************************************************************************************************** */
//CANCEL ORDER

//async function cancelOrder(orderID,quantity,variantID){
//    try {
//        Swal.fire({
//            title: "Are you sure?",
//            text: "You want to cancel this order ?",
//            icon: "question",
//            showCancelButton: true,
//            confirmButtonColor: "#3085d6",
//            cancelButtonColor: "#d33",
//            confirmButtonText: "Yes, Cancel it!",
//                customClass: {
//                popup: 'swal2-popup-custom-font-size'
//            }

//        }).then( async(result) => {
//            if(result.isConfirmed) {
//                const cancelButton = document.getElementById('btnCancel'+variantID);
//                const cancelSpan   = document.getElementById('spanCancel'+variantID)
//                const statusAlert  = document.getElementById('statusH5'+variantID)
//                cancelButton.style.display = 'none';
//                cancelSpan.style.display   = 'block';
                
//                const response = await fetch('/cancel-order',{
//                    method: 'PATCH',
//                    headers: {'Content-Type': 'application/json'},
//                    body: JSON.stringify({
//                        orderId: orderID,
//                        stock: quantity,
//                        variantId: variantID

//                    })
//                })

//                if (response.redirected) {
//                    return window.location.href =response.url
//                }

//                const data = await response.json();
//                if(data.success){
//                    statusAlert.textContent = 'Cancelled'


//                    Swal.fire({
//                    title: "Cancelled!",
//                    text: data.success||"Your order has been cancelled.",
//                    icon: "success",
//                    customClass: {
//                    popup: 'swal2-popup-custom-font-size'
//                     }

//                    })

//                }else if (data.error) {
//                    Swal.fire({
                        
//                        text: data.error||"Something went wrong !.",
//                        icon: "error",
//                        customClass: {
//                            popup: 'swal2-popup-custom-font-size'
//                        } })
//                }

                
//            }
//        });
        
//    } catch (error) {
//        console.error(error);
//        Swal.fire({

//            text: "Something went wrong !.",
//            icon: "error",
//            customClass: {
//                popup: 'swal2-popup-custom-font-size'
//            }
//        })
//    }
//}

/****************************************************************************************************************************************** */
//USER PROFILE UPDATION ONLOAD

  
document.addEventListener('DOMContentLoaded',async () => {
    try {
        //document.querySelectorAll('.statusClass').forEach(item => {
        //    const status=item.dataset.h5status;
        //    const variantID=item.dataset.variantidd;
        //    const parent=item.closest('tr');
        //    const btnCancel=parent.querySelector('.btnCancel');
        //    const spanCancel=parent.querySelector('.spanCancel');
        //    const returnButton=parent.querySelector('.returnButton');

        //    if(status==='Cancelled') {
        //        btnCancel.style.display='none';
        //        spanCancel.textContent='Order Cancelled ';
        //        spanCancel.style.color='red';
        //        spanCancel.style.display='block';
        //    } else if(status==='Completed') {
        //        btnCancel.style.display='none';
        //        spanCancel.textContent='Order Delivered ';
        //        spanCancel.style.color='green';
        //        spanCancel.style.display='block';
        //    } else if(status==='Delivered') {
        //        btnCancel.style.display='none';
        //        returnButton.style.display = 'block'

        //    } else if(status==='Return requested'){
        //        btnCancel.style.display='none';
        //        spanCancel.textContent='Return requested  ';
        //        spanCancel.style.color='blue';
        //        spanCancel.style.display='block';
        //    } else if(status==='Return approved') {
        //        btnCancel.style.display='none';
        //        spanCancel.textContent='Return approved  ';
        //        spanCancel.style.color='green';
        //        spanCancel.style.display='block';
        //    } else if(status==='Return Rejected') {
        //        btnCancel.style.display='none';
        //        spanCancel.textContent='Return rejected  ';
        //        spanCancel.style.color='red';
        //        spanCancel.style.display='block';
        //    } else if(status==='Refunded') {
        //        btnCancel.style.display='none';
        //        spanCancel.textContent='Refunded successfully ';
        //        spanCancel.style.color='green';
        //        spanCancel.style.display='block';
        //    }
        //});

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


/****************************************************************************************************************************************** */
// RETURN REQUEST 
//   async function orderReturn(orderID,variantID){
//    try {
//        Swal.fire({
//            title: "Are you sure?",
//            text: "You want to Return this order ?",
//            icon: "question",
//            showCancelButton: true,
//            confirmButtonColor: "#3085d6",
//            cancelButtonColor: "#d33",
//            confirmButtonText: "Yes, Return it!",
//                customClass: {
//                popup: 'swal2-popup-custom-font-size'
//            }

//        }).then( async(result) => {
//            if(result.isConfirmed) {
//                const returnButton = document.getElementById('returnBtn'+variantID);
//                const statusAlert   = document.getElementById('statusH5'+variantID)
                
//                const response = await fetch('/return-order',{
//                    method: 'PATCH',
//                    headers: {'Content-Type': 'application/json'},
//                    body: JSON.stringify({
//                        orderId: orderID,
//                        variantId: variantID

//                    })
//                })

//                if(response.redirected){
//                    return window.location.href = response.url
//                }

//                const data = await response.json()

//                if(data.success){

//                    returnButton.disabled = true
//                    returnButton.style.opacity = 0.5
//                    statusAlert.textContent = 'Return requested'
//                    statusAlert.style.color = 'blue'

//                    Swal.fire({
//                        title: "Success!",
//                        text: data.success||"Your return request has been placed.",
//                        icon: "success",
//                        customClass: {
//                            popup: 'swal2-popup-custom-font-size'
//                        } })
                  
//                }else if (data.error) {
//                    Swal.fire({
//                        title: "Success!",
//                        text: data.error||"Something went wrong !.",
//                        icon: "error",
//                        customClass: {
//                            popup: 'swal2-popup-custom-font-size'
//                        }
//                    })
                    
//                }

                
//            }
//        });
        
//    } catch (error) {
//        console.error(error);
//        Swal.fire({
//            title: "Oops!",
//            text: "Something went wrong plz try again !.",
//            icon: "error",
//            customClass: {
//                popup: 'swal2-popup-custom-font-size'
//            }

//        })
//    }
//   }





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
            Swal.fire({
                icon: "success",
                text: data.success||"Updated successfully",
                footer: '<a href="/cart" style="color: #3085d6">Go to Cart</a>',
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }
            })
        } else if(data.error) {
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
//LOAD WALLET FUNCTION 

    //async function loadWallet(){
    //    try {
    //            const swalWithBootstrapButtons=Swal.mixin({
    //            customClass: {
    //                confirmButton: "btn btn-success",
    //                cancelButton: "btn btn-danger",
    //            },
    //            buttonsStyling: true
    //        });
    //        swalWithBootstrapButtons.fire({
    //            text: "Continue to Razorpay ?",
    //            icon: "question",
    //            showCancelButton: true,
    //            confirmButtonText: "Yes",
    //            cancelButtonText: "No",
    //            reverseButtons: true,
    //            customClass: {
    //                popup: 'swal2-popup-custom-font-size'
    //            }
    //        }).then(async(result) => {

    //            if(result.isConfirmed) {
                    
    //               const amount = parseInt(document.getElementById('walletInput').value)
    //               const amountRegex = /^(?!0$)(?!0\.0+$)(?!0\.\d+$)\d+(\.\d{1,2})?$/
    //               let valid = true;

    //               if (!amount) {
    //                    valid=false;

    //                       Swal.fire({
    //                       text: "fill the field",
    //                       icon: "error",
    //                       customClass: {
    //                               popup: 'swal2-popup-custom-font-size'
    //                           }
    //                   });
    //               }else if(!amountRegex.test(amount)){
    //                   valid=false;

    //                   Swal.fire({
    //                       text: "Enter valid Amount",
    //                       icon: "error",
    //                       customClass: {
    //                           popup: 'swal2-popup-custom-font-size'
    //                       }
    //                   });
    //               }else if(amount>50000){
    //                   valid=false;

    //                   Swal.fire({
    //                       title: "Amount Exceeded!",
    //                       text: "Enter the amount below 50,000",
    //                       icon: "error",
    //                       customClass: {
    //                           popup: 'swal2-popup-custom-font-size'
    //                       }
    //                   });
    //               }

    //               if (valid) {
    //                const response = await fetch('/load-wallet',{
    //                    method:'POST',
    //                    headers:{'Content-Type':'application/json'},
    //                    body:JSON.stringify({orderAmount:amount})
    //                })

    //                if (response.redirected) {
    //                    return window.location.href=response.url
    //                }

    //                const data  = await response.json()

    //                   if(data.userID&&data.order) {
                        
    //                       const {userID,order,keyID}=data
    //                       const options={
    //                           key: keyID,
    //                           amount: order.amount,
    //                           currency: order.currency,
    //                           name: 'DigiCart ',
    //                           description: 'Recharge user Wallet',
    //                           order_id: order.id, // Razorpay order ID

    //                           handler: async function (response) {
                            
    //                               const paymentData={
    //                                   razorpay_order_id: response.razorpay_order_id,
    //                                   razorpay_payment_id: response.razorpay_payment_id,
    //                                   razorpay_signature: response.razorpay_signature,
    //                                   order_id: userID,
    //                                   orderAmount : order.amount
    //                               };


    //                               // Verify payment 
    //                               const res=await fetch('/wallet/verify-payment',{
    //                                   method: 'POST',
    //                                   headers: {
    //                                       'Content-Type': 'application/json'
    //                                   },
    //                                   body: JSON.stringify(paymentData)
    //                               })

    //                               const data=await res.json();


    //                               if(data.success) {

    //                                   Swal.fire({
    //                                       text: data.success||"Success",
    //                                       icon: "success",
    //                                       customClass: {
    //                                           popup: 'swal2-popup-custom-font-size'
    //                                       }
    //                                   }).then(() => {
    //                                       return window.location.reload()
    //                                   })

    //                               } else if(data.error) {
    //                                   Swal.fire({
    //                                       text: data.error||"Failed",
    //                                       icon: "error",
    //                                       customClass: {
    //                                           popup: 'swal2-popup-custom-font-size'
    //                                       }
    //                                   });

    //                               }

    //                           },
    //                           prefill: {
    //                               name: 'user',
    //                               email: 'your_email@example.com',
                                   
    //                           },

    //                           theme: {
    //                               color: '#1462e0'
    //                           },
    //                           modal: {
    //                               ondismiss: function () {
    //                                   Swal.fire({
    //                                       text: "Payment failed or was dismissed. Please try again.",
    //                                       icon: "error"
    //                                   })
    //                               }
    //                           }

    //                       };
    //                       const rzp1=new Razorpay(options);
    //                       rzp1.open();


    //                   } else {

    //                       Swal.fire({
    //                           text: "Order placement failed",
    //                           icon: "error"
    //                       });
    //                   }

    //                }

    //            }

                    
                
    //        });
            
    //    } catch (error) {
    //        console.error(error);
    //    }
    //}



/************************************************************************************************************************** */
