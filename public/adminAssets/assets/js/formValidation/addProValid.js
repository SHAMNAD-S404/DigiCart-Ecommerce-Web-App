document.getElementById('productForm').addEventListener('submit',async (event)=>{
    event.preventDefault();

    const name=document.getElementById('name').value.trim();
    const description=document.getElementById('description').value.trim();
    const brand=document.getElementById('brand').value.trim();

    const nameRegex=/^[a-zA-Z0-9\s]+$/;
    const descriptionRegex=/^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/;
    const brandRegex=/^[a-zA-Z\s]+$/;

    let isValid=true;

    if(!nameRegex.test(name)||name.length<4) {
        document.getElementById('nameError').textContent='Product title must contain only alphabets, spaces, and numbers, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('nameError').textContent='';
    }

    if(!descriptionRegex.test(description)||description.length<6) {
        document.getElementById('descriptionError').textContent='Description must contain only alphabets, spaces, numbers, and symbols, and must be at least 6 characters long.';
        isValid=false;
    } else {
        document.getElementById('descriptionError').textContent='';
    }

    if(!brandRegex.test(brand)||brand.length<4) {
        document.getElementById('brandError').textContent='Brand must contain only alphabets and spaces, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('brandError').textContent='';
    }

    if(isValid) {
        // Form is valid, submit the form
        //this.submit();
        const formData=new FormData(document.getElementById('productForm'))

        const response=await fetch('/admin/addProduct',{
            method :'POST',
            body:formData
        })

        const data = await response.json()

        if(!data.success) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Product Already Exist",

            });
        }else{
            const result=await Swal.fire({
                icon: "success",
                title: "successful",
                text: "Product added successfully",

            });

            if(result.isConfirmed){
                window.location.href= '/admin/addVariants'
            }


        }
    }
})