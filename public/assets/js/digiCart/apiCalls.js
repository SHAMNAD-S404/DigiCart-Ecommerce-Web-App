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

            const audio = new Audio('/Audio/cart.mp3');
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

/************************************************************************************************************************** */
//ONLOAD FUNCTIONS 

    document.addEventListener('DOMContentLoaded',()=>{
        const buttons = document.querySelectorAll('.stockClass')
        buttons.forEach(item =>{
            const stock= parseInt(item.dataset.stock)          
            const variantID=item.dataset.variantid
            const block = item.dataset.block==='true'
            const stockButton=document.getElementById('stockBtn'+variantID)
            const cartButton=document.getElementById('cartBtn'+variantID)


            if (stock === 0) {
                
                cartButton.style.display = 'none'
                stockButton.style.color = 'white'
                stockButton.style.backgroundColor = 'red'
                stockButton.style.opacity = 0.7
                stockButton.textContent = 'OUT OF STOCK'
                
            }else if (stock > 0 && stock <= 5) {

                stockButton.textContent = 'FEW STOCK LEFT'
                
            }else if(stock > 5){
                stockButton.textContent = 'IN STOCK'
             
                
            }

            if(block) {
                stockButton.textContent='TEMPORARLY UNAVAILABLE'
                cartButton.style.opacity=0.3
                cartButton.style.display='none'
                stockButton.style.color='white'
                stockButton.style.backgroundColor='#15a180'
                stockButton.style.opacity=1
        

            }

        })

    })


/************************************************************************************************************************** */
//ADD TO WISHLIST 

async function addWishlistFunction(variantID) {
    try {


        const response=await fetch('/add-wishlist',{

            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                variantid: variantID

            })


        });


        if(response.redirected) {
            return window.location.href=response.url;
        }

        const data=await response.json()
        if(response.ok) {

            const audio = new Audio('/Audio/wishlist.mp3');
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


        } else if(data.error) {

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
    } catch(error) {
        console.log(error);

    }
}




/************************************************************************************************************************** */