
//CHANGE ORDER STATUS

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click',()=>{
            const status = item.textContent.trim();
            const variantID = item.getAttribute('data-variantId');
            const orderID = item.getAttribute('data-orderId');
            if(status){
                Swal.fire({
                    title: "Are you sure?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, proceed it!"
                }).then(async(result) => {
                    if(result.isConfirmed) {
                        const response = await fetch('/admin/update-order',{
                            method:'PATCH',
                            headers: {'Content-Type':'application/json'},
                            body:JSON.stringify({
                                status,
                                variantID,
                                orderID

                            })
                        })

                        if(response.redirected){
                            return window.location.href =response.url
                        }

                        const data=await response.json()
                        
                        if(data.success){
                            const button = document.getElementById('statusID'+variantID)
                            const returnButton=document.getElementById('returnBtn'+variantID)
                            const h6    = document.getElementById('h6Status'+variantID)
                            button.textContent = status
                            h6.textContent = status
                            if (status === 'Completed') {
                                button.disabled = true
                                button.classList.remove('btn-outline-warning');
                                button.classList.add('btn-outline-success');
                            } else if(status==='Return Rejected'){
                                returnButton.textContent = status
                                returnButton.classList.remove('btn-outline-warning');
                                returnButton.classList.add('btn-outline-danger');
                            } else if(status==='Return approved') {
                                returnButton.textContent=status
                                returnButton.classList.remove('btn-outline-warning');
                                returnButton.classList.add('btn-outline-success');
                            } else if(status==='Refunded') {
                                returnButton.textContent=status
                                returnButton.disabled = true
                                returnButton.classList.remove('btn-outline-warning');
                                returnButton.classList.add('btn-outline-success');
                            }
                            Swal.fire({
                                title: "Updated",
                                text: data.success||"Order status updated .",
                                icon: "success"
                            });

                        }else if(data.error){
                            Swal.fire({
                                title: "failed",
                                text: data.error||"Order status updation failed .",
                                icon: "error"
                            });
                        }else{
                            Swal.fire({
                                title: "Oops",
                                text: "Something error occured ! Try again",
                                icon: "error"
                            });
                        }

                    }
                });
            }
        })
    }) 

//********************************************************************************************************************* */
   //FOR HIDE THE CANCEL BUTTON IF THE STATUS IS CANCEL 

    document.addEventListener('DOMContentLoaded',()=>{
        document.querySelectorAll('button.statusClass').forEach(button =>{
            if (button.textContent.trim()==='Cancelled') {             
              
                   // button.style.display = 'none'; 
                   button.disabled = true 
                   button.style.opacity = 0.5  
                   button.classList.remove('btn-outline-warning');
                   button.classList.add('btn-outline-danger');                          
            }else if (button.textContent.trim()==='Completed') {
                button.disabled=true
                button.classList.remove('btn-outline-warning');
                button.classList.add('btn-outline-success');
                
            }
        })

    //RETURN REQUEST FUNCTION
        document.querySelectorAll('.statusAlert').forEach(item =>{
            const status = item.dataset.status;
            const variantID=item.dataset.variantid;
            const parent = item.closest('tr')
            const actionBtn = parent.querySelector('.statusClass')
            const returnBtn = parent.querySelector('.returnCls')
            const viewReson = document.getElementById('viewReason'+variantID);

            if(status==='Return requested') {
                actionBtn.style.display = 'none'
                returnBtn.style.display = 'block'
                viewReson.style.display = 'block'

                
            } else if(status==='Refunded'){
                actionBtn.style.display='none'
                returnBtn.style.display='block'
                returnBtn.disabled = true
                returnBtn.classList.remove('btn-outline-warning');
                returnBtn.classList.add('btn-outline-success');

            } else if(status==='Return Rejected') {
                actionBtn.style.display='none'
                returnBtn.style.display='block'
                returnBtn.classList.remove('btn-outline-warning');
                returnBtn.classList.add('btn-outline-danger');

            } else if(status==='Return approved') {
                actionBtn.style.display='none'
                returnBtn.style.display='block'
                returnBtn.classList.remove('btn-outline-warning');
                returnBtn.classList.add('btn-outline-success');

            }
        })

        
    })


//********************************************************************************************************************* */
// TO VIEW THE RETURN REASON 

    function viewReason(returnReason){
    
        Swal.fire({
            title: "Return Reason",
            text: returnReason || 'something went wrong!'
            
        });
    }


//********************************************************************************************************************* */