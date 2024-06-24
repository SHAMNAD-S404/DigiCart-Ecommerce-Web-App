
document.addEventListener('DOMContentLoaded',async () => {
    try {
        document.querySelectorAll('.statusClass').forEach(item => {
            const status=item.dataset.h5status;
            const variantID=item.dataset.variantidd;
            const parent=item.closest('tr');
            const btnCancel=parent.querySelector('.btnCancel');
            const spanCancel=parent.querySelector('.spanCancel');
            const returnButton=parent.querySelector('.returnButton');
            const retryPayBtn = document.getElementById('retryBtn'+variantID)

            if(status==='Cancelled') {
                btnCancel.style.display='none';
                spanCancel.textContent='Order Cancelled ';
                spanCancel.style.color='red';
                spanCancel.style.display='block';
            } else if(status==='Completed') {
                btnCancel.style.display='none';
                spanCancel.textContent='Order Delivered ';
                spanCancel.style.color='green';
                spanCancel.style.display='block';
            } else if(status==='Delivered') {
                btnCancel.style.display='none';
                returnButton.style.display='block'

            } else if(status==='Return requested') {
                btnCancel.style.display='none';
                spanCancel.textContent='Return requested  ';
                spanCancel.style.color='blue';
                spanCancel.style.display='block';
            } else if(status==='Return approved') {
                btnCancel.style.display='none';
                spanCancel.textContent='Return approved  ';
                spanCancel.style.color='green';
                spanCancel.style.display='block';
            } else if(status==='Return Rejected') {
                btnCancel.style.display='none';
                spanCancel.textContent='Return rejected  ';
                spanCancel.style.color='red';
                spanCancel.style.display='block';
            } else if(status==='Refunded') {
                btnCancel.style.display='none';
                spanCancel.textContent='Refunded successfully ';
                spanCancel.style.color='green';
                spanCancel.style.display='block';
            } else if(status==='Pending Payment') {
                btnCancel.style.display='block';
                spanCancel.style.color='red';
                retryPayBtn.style.display = 'block'
              

            }
        });

    } catch(error) {
        console.error(error);
    }
});


//?*********************************************************************************************************************

// RETURN REQUEST 
async function orderReturn(orderID,variantID) {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to Return this order ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Return it!",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }

        }).then(async (result) => {
            if(result.isConfirmed) {

                const {value: text}=await Swal.fire({
                    input: "textarea",
                    inputLabel: "Return Reason",
                    inputPlaceholder: "Enter your Return reason here...,length should be 4-60",
                    inputAttributes: {
                        "aria-label": "Type your message here"
                    },
                    customClass: {
                        popup: 'swal2-popup-custom-font-size'
                    },
                    showCancelButton: true
                });
                if(text) {
                    Swal.fire(text);
                    const returnReason = text;
                    const regex=/^[^\s][\w\s.,!@#$%^&*()_+-=]{4,58}[^\s]$/;

                    if (!regex.test(returnReason)) {
                        return Swal.fire({
                            text: "Enter Valid text in  Reason ",
                            icon: "error",
                            customClass: {
                                popup: 'swal2-popup-custom-font-size'
                            }
                        });
                        
                    }
                
                const returnButton=document.getElementById('returnBtn'+variantID);
                const statusAlert=document.getElementById('statusH5'+variantID)

                const response=await fetch('/return-order',{
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        orderId: orderID,
                        variantId: variantID,
                        retrunReason: returnReason

                    })
                })

                if(response.redirected) {
                    return window.location.href=response.url
                }

                const data=await response.json()

                if(data.success) {

                    returnButton.disabled=true
                    returnButton.style.opacity=0.5
                    statusAlert.textContent='Return requested'
                    statusAlert.style.color='blue'

                    Swal.fire({
                        title: "Success!",
                        text: data.success||"Your return request has been placed.",
                        icon: "success",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }
                    })

                } else if(data.error) {
                    Swal.fire({
                        title: "Success!",
                        text: data.error||"Something went wrong !.",
                        icon: "error",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }
                    })

                }


                }else{
                    Swal.fire({
                        text: "Enter the Return reason to continue",
                        icon: "warning",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }
                    });
                }


            }
            
        });

    } catch(error) {
        console.error(error);
        Swal.fire({
            title: "Oops!",
            text: "Something went wrong plz try again !.",
            icon: "error",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }

        })
    }
}

//?*********************************************************************************************************************

//CANCEL ORDER

async function cancelOrder(orderID,quantity,variantID) {
    try {
        console.log(orderID,quantity,variantID);
        Swal.fire({
            title: "Are you sure?",
            text: "You want to cancel this order ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }

        }).then(async (result) => {
            
            if(result.isConfirmed) {
                const cancelButton=document.getElementById('btnCancel'+variantID);
                const cancelSpan=document.getElementById('spanCancel'+variantID)
                const statusAlert=document.getElementById('statusH5'+variantID)
                const retryPayBtn = document.getElementById('retryBtn'+variantID)
                cancelButton.style.display ='none';
                retryPayBtn.style.display  ='none';
                cancelSpan.style.display   ='block';

                const response=await fetch('/cancel-order',{
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        orderId: orderID,
                        stock: quantity,
                        variantId: variantID

                    })
                })

                if(response.redirected) {
                    return window.location.href=response.url
                }

                const data=await response.json();
                if(data.success) {

                    const audio = new Audio('/Audio/cancelorder.wav');
                    audio.play()


                    statusAlert.textContent='Cancelled'


                    Swal.fire({
                        title: "Cancelled!",
                        text: data.success||"Your order has been cancelled.",
                        icon: "success",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }

                    })

                } else if(data.error) {
                    Swal.fire({

                        text: data.error||"Something went wrong !.",
                        icon: "error",
                        customClass: {
                            popup: 'swal2-popup-custom-font-size'
                        }
                    })
                }


            }
        });

    } catch(error) {
        console.error(error);
        Swal.fire({

            text: "Something went wrong !.",
            icon: "error",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }
        })
    }
}



//?*********************************************************************************************************************
//RETRY FAILED PAYMENT

async function orderRetry(orderID,variantID){
    try {

        Swal.fire({
            title: "Do you want to Continue with this Order?",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            customClass: {
                popup: 'swal2-popup-custom-font-size'
            }
        }).then(async(result) => {
            
            if(result.isConfirmed) {

               const response = await fetch('/payment-retry',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({orderID})
               })

               if (response.redirected) {
                return window.location.href =response.url
               }

               const data = await response.json()

               if (data.order) {

                const{order,authCheck,keyID}=data


                   const options={
                       key: keyID,
                       amount: order.amount,
                       currency: order.currency,
                       name: 'DigiCart ',
                       order_id: order.id, // Razorpay order ID

                       handler: async function (response) {

                           const paymentData={
                               razorpay_order_id: response.razorpay_order_id,
                               razorpay_payment_id: response.razorpay_payment_id,
                               razorpay_signature: response.razorpay_signature,
                               order_id: authCheck._id
                           };


                           // Verify payment 
                           const res=await fetch('/order/verify-payment',{
                            
                               method: 'POST',
                               headers: {
                                   'Content-Type': 'application/json'
                               },
                               body: JSON.stringify(paymentData)
                           })


                           const data=await res.json();

                           if(data.success) {

                               Swal.fire({
                                   text: data.success||"Success",
                                   icon: "success",
                                   customClass: {
                                       popup: 'swal2-popup-custom-font-size'
                                   }
                               }).then(() => {
                                   return window.location.href=`/track-order?orderID=${data.order_id}`;
                               })

                           } else if(data.error) {
                               Swal.fire({
                                   text: data.error||"Failed",
                                   icon: "error",
                                   customClass: {
                                       popup: 'swal2-popup-custom-font-size'
                                   }
                               });

                           }
                       },
                    
                       prefill: {
                           name: authCheck.shippingAddress.name,
                           email: 'your_email@example.com',
                           contact: authCheck.shippingAddress.phone
                       },

                       theme: {
                           color: '#1462e0'
                       },
                       modal: {
                           ondismiss: function () {
                               Swal.fire({
                                   text: "Payment failed or was dismissed. Please try again.",
                                   icon: "error",
                                   customClass: {
                                       popup: 'swal2-popup-custom-font-size'
                                   }
                               }).then(() => {
                                   return window.location.href='/orders'
                               })
                           }
                       }
                   };
                   const rzp1=new Razorpay(options);
                   rzp1.open();



                
               } else {
                   Swal.fire({
                       text: "Order placement failed",
                       icon: "error",
                       customClass: {
                           popup: 'swal2-popup-custom-font-size'
                       }
                   });
               }


            } 
        });

        
    } catch (error) {
        console.error(error);
    }
 }




//?*********************************************************************************************************************


