
async function blockItem(button,queryID,subRoute) {

    try {
        
            let value = button.textContent
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
                confirmButtonText: `Yes, ${value} it!`,
                cancelButtonText: "No, cancel!",
                reverseButtons: true

            }).then((result) => {
                if(result.isConfirmed) {
                        swalWithBootstrapButtons.fire({
                            title: `${value}!`,
                            text: `User has been ${value}ed.`,
                            icon: "success"
                    });

                    if(value =="block"){
                        button.textContent = "unblock"
                        button.style.color = "white"
                        button.style.backgroundColor = 'green'
                    }else{
                        button.textContent ="block"
                        button.style.color = "white"
                        button.style.backgroundColor = "red"
                    }

                    fetch(`/admin/${value}-${subRoute}?id=${queryID}`,{
                            headers: {
                                'Content-Type': 'application/json'
                                }

                    })
                        .then(response => {
                            if(response.ok) {

                                 console.log(`category ${value} successfully`);
                                return response.json;
                               
                            } else {
                                console.error(`failed to ${value}`);
                            }
                        })
                        .catch(error => {
                            console.error(`error ${value} category:`,error);
                        });


                } else if(
                    /* Read more about handling dismissals below */
                    result.dismiss===Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: `User not ${value} :)`,
                        icon: "error"
                    });
                }
            });
        

    } catch(error) {
        console.log(error);
    }

}


//For deletion 

async function deleteItem (divID,queryID,subRoute){

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
        reverseButtons: true

    }).then((result) => {
        if(result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

            //hiding div
            document.getElementById(divID).style.display = 'none';

            //fetch function to delete 
            fetch(`/admin/delete-${subRoute}?id=${queryID}`,{
                headers:{
                    'Content-Type' : 'application/json'
                }
            })
                .then(response =>{
                    if (response.ok) {
                        req.flash('messages','Deleted Successfully')
                        console.log('deleted');
                        return response.json;
                    }else{
                        console.error('failed to delete');
                    }
                })
                    .catch(error => {
                        console.error('failed to delete',error);
                    });

        } else if(
            /* Read more about handling dismissals below */
            result.dismiss===Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your file not deleted :)",
                icon: "error"
            });
        }
    });
    
} catch (error) {
    console.log(error);
}

}

//show all images in modal


async function showImages(prouctID){
    try {
        
          const product = prouctID;
          console.log(product);  
        // Array of image URLs
        let imageUrls=[] ;
        imageUrls = product.forEach(element => {
            
            
        });
        
        // Generate HTML for displaying images
        const imagesHtml = imageUrls.map(url => `<img src="${url}" style="max-width: 100%;">`).join('');

        // Show SweetAlert modal with images
        Swal.fire({
            title: 'Images',
            html: imagesHtml,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'image-popup'
            }
            
        });
    console.log('hiiiiiiiii');


        
    } catch (error) {
        console.error(error);
    }
}




