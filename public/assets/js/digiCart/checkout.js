 //LOAD CHECKOUT   

    
    async function checkoutLoad(){
        try {
            const response=await fetch('/checkout',{
                method :'GET',
                headers :{'Content-type':'application/json'},

            })

            if(response.redirected) {
                return window.location.href=response.url
            }

            const data = await response.json();


            if(data.empty){
               
               return  window.location.href = '/cart'
            }
            
        } catch (error) {
            console.error(error);
        }
    }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD ADDRESS 

async function addAddress(){

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

        if(!nameRegex.test(fullname)||fullname.length<4) {
            document.getElementById('nameError').textContent="Enter valid name, min length 4 ! ";
            ok=false;
        } else {
            document.getElementById('nameError').textContent='';
        }

        if(!phoneRegex.test(phoneNumber)) {
            document.getElementById('phoneError').textContent="Enter valid Phone number ! ";
            ok=false;
        } else {
            document.getElementById('phoneError').textContent='';
        }

        if(!addressRegex.test(userAddress)) {
            document.getElementById('addressError').textContent="Enter valid address ! ";
            ok=false;
        } else {
            document.getElementById('addressError').textContent='';
        }

        if(!localityRegex.test(userLocality)) {
            document.getElementById('localityError').textContent="Enter valid Locality  ! ";
            ok=false;
        } else {
            document.getElementById('localityError').textContent='';
        }

        if(!landmarkRegex.test(landmark)) {
            document.getElementById('landmarkError').textContent="Enter valid Landmark ! ";
            ok=false;
        } else {
            document.getElementById('landmarkError').textContent='';
        }

        if(!cityRegex.test(city)) {
            document.getElementById('cityError').textContent="Enter valid city ! ";
            ok=false;
        } else {
            document.getElementById('cityError').textContent='';
        }

        if(!stateRegex.test(state)) {
            document.getElementById('stateError').textContent="Enter valid State name ! ";
            ok=false;
        } else {
            document.getElementById('stateError').textContent='';
        }

        if(!pincodeRegex.test(pincode)||pincode.length<6) {
            document.getElementById('pincodeError').textContent="Enter valid pincode  length 6 ! ";
            ok=false;
        } else {
            document.getElementById('pincodeError').textContent='';
        }

        if(ok) {

          

            const response=await fetch('/add-address',{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({

                    fullname: fullname,
                    phone: phoneNumber,
                    address: userAddress,
                    locality: userLocality,
                    landmark: landmark,
                    city: city,
                    state: state,
                    pincode: pincode,
                    addressType: addressType


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
                    text:"Address added successfully choose one ",

                }).then(() => {
                    window.location.reload()
                })
            } else if(data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.error||"Something went wrong!",

                });
            }

        }

    } catch(error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DOM ONLOAD FUNCTIONS 

    document.addEventListener('DOMContentLoaded',()=>{

        const cashButton      = document.getElementById('buttonCOD')
        const onlineButton    = document.getElementById('buttonONLINE')
        const walletButton    = document.getElementById('buttonWALLET')
        const cancelButton    = document.getElementById('backtoCartBtn');
        const walletBalance   = document.getElementById('walletBalance');
        const cancelCouponBtn = document.getElementById('couponCancel')
        const trDetail        = document.getElementById('trDiscount')
        

        cashButton.style.display      = 'none';
        onlineButton.style.display    = 'none';
        walletButton.style.display    = 'none';
        walletBalance.style.display   = 'none';
        cancelButton.style.display    = 'none';
        cancelCouponBtn.style.display = 'none';
        trDetail.style.display        = 'none';

        


    })

//? ************************************************************************************************************************

//ADDRESS SELECTION VERIFY AND ORDER PLACEMENT
     async function verifyAddress(){
        try {

            const selectedAddressID = document.querySelector('input[name="addressRadio"]:checked');

            if ( !selectedAddressID) {

                    Swal.fire({
                    text: "Select a address to continue !",
                    icon: "error"
                });
            }else{
                const address = selectedAddressID.value;

                const cashButton   = document.getElementById('buttonCOD')
                const onlineButton = document.getElementById('buttonONLINE')
                const walletButton = document.getElementById('buttonWALLET')
                const walletBalance= document.getElementById('walletBalance');
                const chooseButton = document.getElementById('choosePaymentBtn')
                const cancelButton = document.getElementById('backtoCartBtn');
                const couponDiv    = document.getElementById('applyCouponDiv')
                const viewCoupon   = document.getElementById('viewCoupon')

                //WALLET AMOUNT LESS THAN GRAND TOTAL CHECKING
                const grandTotal   = parseInt(document.getElementById('couponTotalSpan').textContent)
                let walletAmount = null;
                let balanceValue = 0;

                if(walletBalance !==null && walletBalance.textContent !== null  ) {

                    walletAmount = walletBalance.textContent;
                    balanceValue = walletAmount.split(':')[1].trim();
                }
               
              

                cashButton.style.display   = 'block';
                onlineButton.style.display = 'block';              
                cancelButton.style.display = 'block';
                chooseButton.style.display = 'none' ;
                couponDiv.style.display    = 'none' ;
                viewCoupon.style.display   = 'none' ;

                //IF WALLET BALNCE BUTTON NOT HIDED
                if(walletBalance !== null) {

                     walletButton.style.display = 'block';
                     walletBalance.style.display= 'block';

                    //IF WALLET BALANCE IS LESS THAN GRAND TOTAL
                        if (grandTotal>parseInt(balanceValue)) {
                            walletButton.style.display='none';
                            walletBalance.style.display='none';
                        }
                }

                //FOR HIDING CASH ON DELIVERY AND ONLINE PAYMENT ACCORDING TO TOTAL
                if(grandTotal>5000&&grandTotal<40000) {

                    cashButton.style.display='none';
                    onlineButton.style.display='block';

                }

               

                //CASH ON DELIVERY
                cashButton.addEventListener('click',async()=>{

                    Swal.fire({
                        title: "Are you sure?",
                        text: "Confirm Order ?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, proceed it!"
                    }).then(async(result) => {
                        if(result.isConfirmed) {

                            const selectedAddress=address;
                            const paymentMethod='COD';
                            const coupon=document.getElementById('coupon_code').value
                            let couponCode = null;
                            if (coupon) {
                                couponCode = coupon;
                            }

                            const response=await fetch('/place-order',{
                                method: 'POST',
                                headers: {'Content-type': 'application/json'},
                                body: JSON.stringify({
                                    addressId: selectedAddress,
                                    paymentMode: paymentMethod,
                                    couponCode : couponCode
                                })
                            })

                            if(response.redirected) {
                                return window.location.href=response.url;
                            }

                            const data=await response.json();

                            if(data.success) {

                                //TO PLAY NOTIFICATION
                                const audio=new Audio('/Audio/order.mp3')
                                audio.play();


                                Swal.fire({
                                    text: data.success||"Order placed Successfully",
                                    icon: "success"
                                }).then(() => {

                                    window.location.href=`/track-order?orderID=${data.orderID}`;

                                })
                            } else if(data.empty) {
                               
                                  return window.location.href='/cart';
                                
                            } else if(data.error) {
                                Swal.fire({
                                    text: data.error||" Oops ! Please Try again ",
                                    icon: "error"
                                });
                            }
                        }
                    });
                });

    //******************************************************************************************************* */

                //ONCLICK FUNCTION ON ONLINE PAYMENT SECTION
                buttonONLINE.addEventListener('click',async () => {

                    Swal.fire({
                        title: "Are you sure?",
                        text: "Confirm Order ?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, proceed it!"

                    }).then(async (result) => {
                        if(result.isConfirmed) {

                            const selectedAddress=address;
                            const paymentMethod='ONLINE PAYMENT';
                            const coupon=document.getElementById('coupon_code').value
                            let couponCode=null;
                            if(coupon) {
                                couponCode=coupon;
                            }

                            const response=await fetch('/place-order',{
                                method: 'POST',
                                headers: {'Content-type': 'application/json'},
                                body: JSON.stringify({
                                    addressId: selectedAddress,
                                    paymentMode: paymentMethod,
                                    couponCode: couponCode
                                })
                            })

                            if(response.redirected) {
                                return window.location.href=response.url;
                            }
                            const data=await response.json()
   
                            if(data.order&&data.placeOrder) {

                                const {order,placeOrder,keyID}=data
                                const options={
                                    key: keyID, 
                                    amount: order.amount, 
                                    currency: order.currency,
                                    name: 'DigiCart ',
                                    //description: 'Your product description',
                                    //image: '/your_logo.png', 
                                    order_id: order.id, // Razorpay order ID
                                
                                    
                                    handler: async function (response) {
                                       
                                        const paymentData={
                                            razorpay_order_id: response.razorpay_order_id,
                                            razorpay_payment_id: response.razorpay_payment_id,
                                            razorpay_signature: response.razorpay_signature,
                                            order_id: placeOrder._id
                                        };
                                        

                                        // Verify payment 
                                        const res = await fetch('/order/verify-payment',{
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(paymentData)
                                        })                                   
                                       
                                            const data = await res.json();
                                            
                                            if(data.success) {

                                                //TO PLAY NOTIFICATION
                                                const audio = new Audio('/Audio/order.mp3')
                                                audio.play();
 
                                                Swal.fire({
                                                    text: data.success||"Success",
                                                    icon: "success"
                                                }).then(()=>{
                                                    return window.location.href=`/track-order?orderID=${data.order_id}`;
                                                })
                                                
                                            }else if(data.error){
                                                Swal.fire({
                                                    text: data.error||"Failed",
                                                    icon: "error"
                                                });
                                                
                                            }                                        
                                    },
                                    prefill: {
                                        name: placeOrder.shippingAddress.name,
                                        email: 'your_email@example.com',
                                        contact: placeOrder.shippingAddress.phone
                                    },
                                   
                                    theme: {
                                        color: '#1462e0'
                                    },
                                    modal: {
                                        ondismiss: function () {
                                            Swal.fire({
                                            text: "Payment failed or was dismissed. Please try again.",
                                            icon: "error"
                                                }).then(()=>{
                                                    return window.location.href='/orders'
                                                })
                                        }
                                    }                                    
                                };
                                const rzp1=new Razorpay(options);
                                rzp1.open();
                              
                            }else{                                
                                    Swal.fire({                                   
                                    text: "Order placement failed",
                                    icon: "error"
                                });
                            }
                        }
                    });
                });

    //***************************************************************************************************** */
    
    //IF WALLET BALANCE NOT HIDED
    if(walletBalance!==null) 
            
        
    {           //WALLET DELIVERY
                walletButton.addEventListener('click',async () => {

                    Swal.fire({
                        title: "Are you sure?",
                        text: "Confirm Order ?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, proceed it!"
                    }).then(async (result) => {
                        if(result.isConfirmed) {

                            const selectedAddress=address;
                            const paymentMethod='WALLET';
                            const coupon=document.getElementById('coupon_code').value
                            let couponCode=null;
                            if(coupon) {
                                couponCode=coupon;
                            }

                            const response=await fetch('/place-order',{
                                method: 'POST',
                                headers: {'Content-type': 'application/json'},
                                body: JSON.stringify({
                                    addressId: selectedAddress,
                                    paymentMode: paymentMethod,
                                    couponCode: couponCode
                                })
                            })

                            if(response.redirected) {
                                return window.location.href=response.url;
                            }

                            const data=await response.json();

                            if(data.success) {

                                //TO PLAY NOTIFICATION
                                const audio=new Audio('/Audio/order.mp3')
                                audio.play();

                                Swal.fire({
                                    text: data.success||"Order placed Successfully",
                                    icon: "success"
                                }).then(() => {

                                    window.location.href=`/track-order?orderID=${data.orderID}`;

                                })
                            } else if(data.empty) {
                                Swal.fire({
                                    text: data.empty||"Your cart is empty",
                                    icon: "error"
                                }).then(() => {
                                    window.location.href='/cart'
                                })
                            } else if(data.error) {
                                Swal.fire({
                                    text: data.error||" Oops ! Please Try again ",
                                    icon: "error"
                                });
                            }
                        }
                    });
                });
    }
                
            }
            
        } catch (error) {
            console.error(error);
            Swal.fire({
                text: "Something went wrong !",
                icon: "error"
            });
        }
     }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//APPLY COUPON 

 async function applyCoupon(total){
    try {
            Swal.fire({
            text: "Are sure to apply this coupon",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, apply it!"

        }).then(async(result) => {

            if(result.isConfirmed) {

                //HIDE SHOW COUPONS
                //document.getElementById('viewCoupon').style.display = 'none';
                
                const couponCode = document.getElementById('coupon_code').value
                if (!couponCode) {
                        return Swal.fire({
                        text: "Please fill the field",
                        icon: "warning"
                    });
                }else{
                    const response=await fetch(`/check-coupon?code=${couponCode}&total=${total}`,{
                        method : 'GET',
                        headers: {'Content-type':'application/json'}
                    })

                    if (response.redirected) {
                        return window.location.href=response.url;
                    }

                    const data = await response.json()

                    if (data.success) {

                        const applyCouponBtn  = document.getElementById('applyCoupnBtn')
                        const cancelCouponBtn = document.getElementById('couponCancel')
                        const trDetailCoupon  = document.getElementById('trDiscount')
                        const discountSpan    = document.getElementById('couponSpan')
                        const totalSpan       = document.getElementById('couponTotalSpan')

                        applyCouponBtn.style.display  =  'none'
                        cancelCouponBtn.style.display = 'block'
                        trDetailCoupon.style.display  = 'block';
                        discountSpan.textContent = data.finalDiscount;
                        totalSpan.textContent    = data.finalTotal;

                            Swal.fire({
                            text: data.success||"Success",
                            icon: "success"
                        });


                    }else if (data.error) {
                            Swal.fire({
                            text: data.error||"Failed",
                            icon: "error"
                        });
                    }

                }
            }
        });
        
    } catch (error) {
        console.error(error);
    }
 }

 //************************************************************************************************************ */
 //?COPY COUPON CODE

document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click',function (event) {
        event.preventDefault(); // Prevent the default button behavior
        const code=this.getAttribute('data-code');
        navigator.clipboard.writeText(code).then(() => {
            alert('Coupon code copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ',err);
        });
    });
});
//************************************************************************************************************ */