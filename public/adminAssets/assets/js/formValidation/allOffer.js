/******************************************************************************************************************** */
//ONLOAD FUNCIONS
document.addEventListener('DOMContentLoaded',() => {
    const button=document.querySelectorAll('.onloadP')
    button.forEach(item => {
        const block=item.dataset.block==='true'
        const couponID=item.dataset.id
        const activeButton=document.getElementById('activateBtn'+couponID)
        const deativeButton=document.getElementById('deactivateBtn'+couponID)

        if(block) {
            deativeButton.style.display='none'
            activeButton.style.display='block'
        } else {
            deativeButton.style.display='block'
            activeButton.style.display='none'
        }


    })
})



/******************************************************************************************************************** */

//BLOCK OFFER 

    async function block(offerID){

        const activeButton=document.getElementById('activateBtn'+offerID)
        const deativeButton=document.getElementById('deactivateBtn'+offerID)

        try {
            Swal.fire({
                text: "You want to deactivate this offer ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, proceed"
            }).then(async(result) => {
                if(result.isConfirmed) {
                    const response = await fetch('/admin/block-offer',{
                        method:'PATCH',
                        headers :{'Content-Type':'application/json'},
                        body:JSON.stringify({offerID})
                    })

                    if (response.redirected) {
                        return window.location.href=response.url
                    }

                    const data =await response.json()

                    if (data.success) {

                        //BUTTON HIDE AND SHOW
                        deativeButton.style.display='none'
                        activeButton.style.display='block'

                        Swal.fire({
                            text: data.success||"Success",
                            icon: "success"
                        });
                        
                    }else if(data.error){

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

//UNBLOCK OFFER 

    async function unblock(offerID){

        const activeButton=document.getElementById('activateBtn'+offerID)
        const deativeButton=document.getElementById('deactivateBtn'+offerID)

        try {
            Swal.fire({
                text: "You want to deactivate this offer ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, proceed"
            }).then(async(result) => {
                if(result.isConfirmed) {
                    const response = await fetch('/admin/unblock-offer',{
                        method:'PATCH',
                        headers :{'Content-Type':'application/json'},
                        body:JSON.stringify({offerID})
                    })

                    if (response.redirected) {
                        return window.location.href=response.url
                    }

                    const data =await response.json()

                    if (data.success) {

                        //BUTTON HIDE AND SHOW
                        deativeButton.style.display='block'
                        activeButton.style.display='none'

                        Swal.fire({
                            text: data.success||"Success",
                            icon: "success"
                        });
                        
                    }else if(data.error){

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

    //* ****************************************************************************************************************
     




    //* ****************************************************************************************************************