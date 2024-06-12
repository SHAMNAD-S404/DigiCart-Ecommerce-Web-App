/******************************************************************************************************************** */
//ONLOAD FUNCIONS
document.addEventListener('DOMContentLoaded',() => {
    const button=document.querySelectorAll('.onloadP')
    button.forEach(item => {
        const block=item.dataset.block==='true'
        const couponID=item.dataset.id
        const activeButton=document.getElementById('activateBtn'+couponID)
        const deativeButton=document.getElementById('deactivateBtn'+couponID)

        if (block) {
            deativeButton.style.display = 'none'
            activeButton.style.display = 'block'
        }else{
            deativeButton.style.display='block'
            activeButton.style.display='none'
        }

        
    })
})



/******************************************************************************************************************** */
//BLOCK COUPON 
 async function block(couponID){
    try {
        Swal.fire({
            text: "You Want to Deactivate this coupon?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then(async(result) => {
            if(result.isConfirmed) {
                const response = await fetch('/admin/block-coupon',{
                    method : 'PATCH',
                    headers : {'Content-Type':'application/json'},
                    body : JSON.stringify({couponID})
                })

                if (response.redirected) {
                    return window.location.href = response.url
                }

                const data = await response.json()

                if (data.success) {
                    //HIDE AND SHOW THE BUTTONS
                    const deactivateButton=document.getElementById('deactivateBtn'+couponID)
                    const activateButton=document.getElementById('activateBtn'+couponID)
                    deactivateButton.style.display = 'none'
                    activateButton.style.display = 'block'

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
        });
        
    } catch (error) {
        console.error(error);
    }
 }



/******************************************************************************************************************** */

//UNBLOCK COUPON 
 async function unblock(couponID){
    try {
        Swal.fire({
            text: "You Want to Activate this coupon?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then(async(result) => {
            if(result.isConfirmed) {
                const response = await fetch('/admin/unblock-coupon',{
                    method : 'PATCH',
                    headers : {'Content-Type':'application/json'},
                    body : JSON.stringify({couponID})
                })

                if (response.redirected) {
                    return window.location.href = response.url
                }

                const data = await response.json()

                if (data.success) {
                    //HIDE AND SHOW THE BUTTONS
                    const deactivateButton=document.getElementById('deactivateBtn'+couponID)
                    const activateButton=document.getElementById('activateBtn'+couponID)
                    deactivateButton.style.display = 'block'
                    activateButton.style.display = 'none'

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
        });
        
    } catch (error) {
        console.error(error);
    }
 }



/******************************************************************************************************************** */
 //REMOVE COUPON 

 async function removeCoupon(couponID){
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async(result) => {
            if(result.isConfirmed) {

                const response = await fetch(`/admin/remove-coupon?id=${couponID}`,{
                    method : 'DELETE',
                    headers : {'Content-Type':'application/json'}

                })

                if (response.redirected) {
                    return window.location.href=response.url
                }

                const data = await response.json();

                if (data.success) {
                    const row=document.getElementById('rowCoupon'+couponID)
                    row.style.display='none'

                        Swal.fire({
                        text: data.success||"Success",
                        icon: "success"
                        });
                    
                    
                }else if (data.error) {
                    
                        Swal.fire({
                        text: data.success||"Success",
                        icon: "success"
                        });
                    
                }

                
            }
        });
        
    } catch (error) {
        console.error(error);
    }
 }



/******************************************************************************************************************** */
//EDIT COUPON

async function editCoupon(couponID){
    try {
        const response = await fetch(`/admin/edit-coupon?id=${couponID}`,{
            method:'GET'
            
        })

        if (response.redirected) {
            return window.location.href=response.url
        }

        const data = await response.json()

        if (!response.ok) {
            Swal.fire({
                text: data.invalid||"Something went wrong",
                icon: "success"
            });

        }


    } catch (error) {
        console.error(error);
    }
}


/******************************************************************************************************************** */