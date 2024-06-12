//LOAD WALLET FUNCTION 

    async function loadWallet(){
        try {
                const swalWithBootstrapButtons=Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: true
            });
            swalWithBootstrapButtons.fire({
                text: "Continue to Razorpay ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                reverseButtons: true,
                customClass: {
                    popup: 'swal2-popup-custom-font-size'
                }
            }).then(async(result) => {

                if(result.isConfirmed) {
                    
                   const amount = parseInt(document.getElementById('walletInput').value)
                   const amountRegex = /^(?!0$)(?!0\.0+$)(?!0\.\d+$)\d+(\.\d{1,2})?$/
                   let valid = true;

                   if (!amount) {
                        valid=false;

                           Swal.fire({
                           text: "fill the field",
                           icon: "error",
                           customClass: {
                                   popup: 'swal2-popup-custom-font-size'
                               }
                       });
                   }else if(!amountRegex.test(amount)){
                       valid=false;

                       Swal.fire({
                           text: "Enter valid Amount",
                           icon: "error",
                           customClass: {
                               popup: 'swal2-popup-custom-font-size'
                           }
                       });
                   }else if(amount>50000){
                       valid=false;

                       Swal.fire({
                           title: "Amount Exceeded!",
                           text: "Enter the amount below 50,000",
                           icon: "error",
                           customClass: {
                               popup: 'swal2-popup-custom-font-size'
                           }
                       });
                   }

                   if (valid) {
                    const response = await fetch('/load-wallet',{
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({orderAmount:amount})
                    })

                    if (response.redirected) {
                        return window.location.href=response.url
                    }

                    const data  = await response.json()

                       if(data.userID&&data.order) {
                        
                           const {userID,order,keyID}=data
                           const options={
                               key: keyID,
                               amount: order.amount,
                               currency: order.currency,
                               name: 'DigiCart ',
                               description: 'Recharge user Wallet',
                               order_id: order.id, // Razorpay order ID

                               handler: async function (response) {
                            
                                   const paymentData={
                                       razorpay_order_id: response.razorpay_order_id,
                                       razorpay_payment_id: response.razorpay_payment_id,
                                       razorpay_signature: response.razorpay_signature,
                                       order_id: userID,
                                       orderAmount : order.amount
                                   };


                                   // Verify payment 
                                   const res=await fetch('/wallet/verify-payment',{
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
                                           return window.location.reload()
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
                                   name: 'user',
                                   email: 'your_email@example.com',
                                   
                               },

                               theme: {
                                   color: '#1462e0'
                               },
                               modal: {
                                   ondismiss: function () {
                                       Swal.fire({
                                           text: "Payment failed or was dismissed. Please try again.",
                                           icon: "error"
                                       })
                                   }
                               }

                           };
                           const rzp1=new Razorpay(options);
                           rzp1.open();


                       } else {

                           Swal.fire({
                               text: "Order placement failed",
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

