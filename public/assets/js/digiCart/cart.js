
//DELETE ITEAMS  FROM CART

async function deleteCart(variantID){
    try {

        const tableRowID = document.getElementById('deleteRow'+variantID)

        const swalWithBootstrapButtons=Swal.mixin({
                customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
                buttonsStyling: true
        });
            swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            //text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true

        }).then(async (result) => {
            if(result.isConfirmed) {

                const response = await fetch('/delete-cart',{
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        variantID
                    })
                })

                if(response.redirected) {
                    return window.location.href=response.url;
                }

                const data = await response.json();

                if(data.success) {

                    //TO PLAY NOTIFICATION SOUND

                    const audio=new Audio('/Audio/delete.mp3');
                    audio.play();

                    tableRowID.style.display='none';

                    const totalUnit = parseInt(document.getElementById('totalPrice'+variantID).innerText);
                    const subTotalKey = document.getElementById('subTotalID')
                    const totalChargeKey = document.getElementById('totalID');
                    const deliveryCharge=document.getElementById('shipChargeID')
                    subTotalKey.innerText = parseInt(subTotalKey.innerText) - totalUnit;
                    totalChargeKey.innerText = parseInt(totalChargeKey.innerText) - totalUnit;
                    deliveryCharge.innerText = subTotalKey > 10000 ? `free shipping` : 60.00;  


                        Swal.fire({
                        icon: "success",
                        text: data.success||"Deleted successfully",

                    })
                } else if(data.error) {
                        Swal.fire({
                        icon: "error",
                        //title: "failed...",
                        text: data.error||"Something went wrong!",

                    });
                }

            } else {
                    swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your file not deleted :)",
                    icon: "error"
                });
            }
        })

    } catch(error) {
        console.error(error);
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
    }

}

/************************************************************************************************************************************************* */
document.addEventListener('DOMContentLoaded',()=>{

    const subTotal = document.querySelectorAll('.subTotalAmt')
    
    let totalAmount = 0;
    for(let i=0; i< subTotal.length; i++){

        let subAmount = parseInt(subTotal[i].innerText.trim())
        totalAmount += subAmount;
    }

    document.getElementById('subTotalID').innerText = totalAmount ;

    const deliveryCharge = document.getElementById('shipChargeID')
    deliveryCharge.innerText = totalAmount > 10000 ? `free shipping` : 60 ;
    const finalAmount  = totalAmount > 10000 ? totalAmount : totalAmount + 60 ;
    document.getElementById('totalID').innerText = finalAmount ;


})





/************************************************************************************************************************************************* */

function decreaseQuantity(variantID,variantStock){
   
    const quantityInput=document.getElementById('quantityID'+variantID);
    const currentValue = parseInt(quantityInput.value);
    const currentStock = parseInt(variantStock)
    if(currentValue > 1 ){

        if (currentValue > currentStock) {

            const increaseButton=document.getElementById('increaseButton'+variantID);
            increaseButton.style.display='none';

            quantityInput.value=currentStock;


            //TOAST CALL
            const Toast=Swal.mixin({
                toast: true,
                position: 'bottom',
                iconColor: 'white',
                customClass: {
                    popup: 'colored-toast',
                },
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            (async () => {
                await Toast.fire({
                    icon: 'info',
                    title: `'We're sorry only : ${currentStock} stock left`
                })
            })();
            
        }else{

            quantityInput.value  = currentValue - 1;
            const increaseButton = document.getElementById('increaseButton'+variantID);
            const decreaseButton = document.getElementById('decreaseButton'+variantID);
            const singlePrice=parseInt(document.getElementById('unitPrice'+variantID).innerText)
            const subTotalKey=document.getElementById('subTotalID')
            const totalChargeKey=document.getElementById('totalID');
            const deliveryCharge=document.getElementById('shipChargeID')
            subTotalKey.innerText=parseInt(subTotalKey.innerText) - singlePrice;
            totalChargeKey.innerText= parseInt(subTotalKey.innerText) > 10000 ?  parseInt(totalChargeKey.innerText) - singlePrice : 60 + parseInt(totalChargeKey.innerText) - singlePrice;
            deliveryCharge.innerText=subTotalKey.innerText >10000? `free shipping`:60.00;


            increaseButton.style.display = 'none';
            decreaseButton.style.display = 'none';
            
            incrementCart(variantID);
            
            }
    }else{
        const Toast=Swal.mixin({
            toast: true,
            position: 'bottom',
            iconColor: 'white',
            customClass: {
                popup: 'colored-toast',
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });

        (async () => {
            await Toast.fire({
                icon: 'error',
                title: 'Min quantity is 1',
            })
        })();
    }

}

function increaseQuantity(variantID,variantStock,status){

    const quantityInput = document.getElementById('quantityID'+variantID);
    const alert         = document.getElementById('statusAlert'+variantID);
    const currentValue = parseInt(quantityInput.value);
    const currentStock = parseInt(variantStock);
    if(currentValue < 5){

            if(status == 'true'){

                const increaseButton=document.getElementById('increaseButton'+variantID);
                const decreaseButton=document.getElementById('decreaseButton'+variantID);
                const otherAlert=document.getElementsByClassName('pStatus'+variantID);
                increaseButton.style.display='none';
                decreaseButton.style.display='none';
                alert.style.display = 'block';
                alert.style.color   = 'red'
                alert.innerText = 'Product is unavilable'

                for(let i=0 ; i<otherAlert.length ; i++){
                    otherAlert[i].style.display = 'none'
                }
           
                
                //TOAST MSSG 
                const Toast=Swal.mixin({
                    toast: true,
                    position: 'bottom',
                    iconColor: 'white',
                    customClass: {
                        popup: 'colored-toast',
                    },
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
                (async () => {
                    await Toast.fire({
                        icon: 'error',
                        title: `We 're sorry product is temporarily unavilabe`,
                    })
                })();

            }else if(currentStock <= 1 ){

                const increaseButton=document.getElementById('increaseButton'+variantID);
                const decreaseButton=document.getElementById('decreaseButton'+variantID);
                increaseButton.style.display='none';
                decreaseButton.style.display='none';

                quantityInput.value=currentStock;



            }else if(currentValue >= currentStock){
        
                const increaseButton=document.getElementById('increaseButton'+variantID);
                increaseButton.style.display='none';

                quantityInput.value = currentStock;


                //TOAST CALL
                const Toast=Swal.mixin({
                    toast: true,
                    position: 'bottom',
                    iconColor: 'white',
                    customClass: {
                        popup: 'colored-toast',
                    },
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                 (async () => {
                    await Toast.fire({
                        icon: 'info',
                        title: `'We're sorry only : ${currentStock} stock left`
                    })
                })();

            }else{

        quantityInput.value  = currentValue + 1 ;
        const increaseButton = document.getElementById('increaseButton'+variantID);
        const decreaseButton = document.getElementById('decreaseButton'+variantID);
        const singlePrice    = parseInt(document.getElementById('unitPrice'+variantID).innerText)
        const subTotalKey    = document.getElementById('subTotalID')
        const totalChargeKey = document.getElementById('totalID');
        subTotalKey.innerText = parseInt(subTotalKey.innerText) + singlePrice ;

        const deliveryCharge=document.getElementById('shipChargeID')
        deliveryCharge.innerText= parseInt (subTotalKey.innerText) < 10000?  60.00 : 'free shipping .final prize will apply on checkout'
    
                if(parseInt(totalChargeKey.innerText) < 10000) {
                 totalChargeKey.innerText = parseInt(totalChargeKey.innerText)+60+singlePrice
             }  else{
                 totalChargeKey.innerText=parseInt(totalChargeKey.innerText)+singlePrice
             }


                        
        increaseButton.style.display = 'none';
        decreaseButton.style.display = 'none';

        incrementCart(variantID);

        }
        
    }else{
        const Toast=Swal.mixin({
            toast: true,
            position: 'bottom',
            iconColor: 'white',
            customClass: {
                popup: 'colored-toast',
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
        (async () => {
            await Toast.fire({
                icon: 'error',
                title: 'Maximum limit is exceeded',
            })
        })();
    }
}



        async function incrementCart(variantID){
            try {

                const quantity = parseInt (document.getElementById('quantityID'+variantID).value)
                const response = await fetch('/edit-cart',{
                    method : "PATCH",
                    headers : {'Content-Type':'application/json'},
                    body : JSON.stringify({
                        variantID,
                        quantity

                    })
                })

                if(response.redirected) {
                    return window.location.href=response.url;
                } 
                
                const data = await response.json()

                if(data.newQuantity) {

                    const inpufield      = document.getElementById('quantityID'+variantID) ; 
                    inpufield.value      = data.newQuantity;
                    const increaseButton = document.getElementById('increaseButton'+variantID);
                    const decreaseButton = document.getElementById('decreaseButton'+variantID);
                    const unitPrice      = parseInt(document.getElementById('unitPrice'+variantID).innerText);
                    const totalPrice     = document.getElementById('totalPrice'+variantID);
                    totalPrice.innerText     = data.newQuantity * unitPrice;
                    


                    increaseButton.style.display = 'block';
                    decreaseButton.style.display = 'block';
                   

                    
                }else if (data.error) {

                    const Toast=Swal.mixin({
                        toast: true,
                        position: 'bottom',
                        iconColor: 'white',
                        customClass: {
                            popup: 'colored-toast',
                        },
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    (async () => {
                        await Toast.fire({
                            icon: 'error',
                            title: data.error ||'failed to add',
                        })
                    })();

                }

                
            } catch (error) {
                console.log(error);
            }
        }