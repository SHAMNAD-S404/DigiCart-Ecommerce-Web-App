
    //PAGE ON LOADING FUNCTIONS 

    document.addEventListener('DOMContentLoaded',()=>{

        const button = document.querySelectorAll('.cartClass')
        button.forEach(item => {
            const stock = parseInt(item.dataset.stock)
            const variantID = item.dataset.variantid
            const block = item.dataset.block === 'true'
            const cartButton = document.getElementById('addToCart'+variantID)
            const spanAlert = document.getElementById('spanStock'+variantID)

            if (stock <= 0) {
                cartButton.disabled=true;
                cartButton.textContent = 'OUT OF STOCK'
                cartButton.style.backgroundColor = 'red'
                cartButton.style.color = 'white'
                spanAlert.textContent = 'OUT OF STOCK'
                spanAlert.style.color = 'red'
                
            }else if (stock > 5 ) {
                spanAlert.textContent='IN STOCK '
                spanAlert.style.color='green'
                
            }else if (stock > 0 && stock <= 5) {
                spanAlert.textContent = 'FEW  STOCK LEFT'
                spanAlert.style.color= '#eb5809'
            }

            
        })

        //const offerDetails = document.getElementById('offerPtag')
        //const productOffname = offerDetails.dataset.offers
        //const productPercentage=offerDetails.dataset.offerPercentage
        //if(offerDetails.dataset.category !==null) {
        //    const categoryOffname = offerDetails.dataset.category
        //}
        
        //const categoryPercentage=offerDetails.dataset.categoryPercentage

        //console.log(productOffname,productPercentage);
        //console.log(categoryOffname,categoryPercentage);


    })


    /********************************************************************************************************************* */
    //ADD TO CART FUNCTION

        async function addToCart(variantID){
            try {

                const response = await fetch('/add-cart',{
                    method : 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify({
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
                            

                    })
                } else if(data.error) {

                    //TO PLAY NOTIFICATION SOUND

                    const audio=new Audio('/Audio/serror.mp3');
                    audio.play();

                        Swal.fire({
                        icon: "error",
                        text: data.error||"Something went wrong!",

                    });
                }
                
            } catch (error) {
                console.error(error);
                    Swal.fire({
                    icon: "error",
                    text: "Something went wrong!",
                });
            }
        }



    /********************************************************************************************************************* */

    //ADD TO WISHLIST FUNCTION

async function addWishlistFunction(variantID){
    try {

       
        const response = await fetch('/add-wishlist',{
            
            method :'POST',
            headers : {'Content-Type':'application/json'},
            body:JSON.stringify({
                variantid:variantID
    
            }) 
            
        
        });
   

        if(response.redirected) {
            return window.location.href=response.url;
        }

        const data = await response.json()
        if (response.ok) {
            
            const audio=new Audio('/Audio/wishlist.mp3');
            audio.play();

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
                    icon: 'success',
                    title: data.success||'Added to wishlist',
                })
            })();
           
            
        }else if(data.error){

            //TO PLAY NOTIFICATION SOUND

                    const audio=new Audio('/Audio/serror.mp3');
                    audio.play();

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
                    icon: 'error',
                    title: data.error||'failed to add',
                })
            })();
            
        } 
    } catch (error) {
        console.log(error);
       
    }
}


    /********************************************************************************************************************* */
   


    /********************************************************************************************************************* */