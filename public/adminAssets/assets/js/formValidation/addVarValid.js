document.getElementById('variantForm').addEventListener('submit',async function (event) {
    event.preventDefault();

    const variantName=document.getElementById('variantName').value.trim();
    const price=document.getElementById('price').value.trim();
    const color=document.getElementById('color').value.trim();
    const stock=document.getElementById('stock').value.trim();
   
    //const ram=document.getElementById('ram').value.trim();
    //const phoneMemory=document.getElementById('phoneMemory').value.trim();
   //const size=document.getElementById('size').value.trim();

    const variantNameRegex=/^[a-zA-Z0-9\s]{3,}$/;
    const priceRegex=/^[1-9]\d*$/;
    const colorRegex=/^[a-zA-Z\s]{3,}$/;
    const stockRegex=/^[1-9]\d*$/;
    //const ramRegex=/^[a-zA-Z0-9\s]{3,}$/;
    //const phoneMemoryRegex=/^[a-zA-Z0-9\s]{3,}$/;
    //const sizeRegex=/^[a-zA-Z0-9\s]{3,}$/;



    let isValid=true;

    if(!variantNameRegex.test(variantName)) {
        document.getElementById('variantNameError').textContent='Variant name must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
        isValid=false;
    } else {
        document.getElementById('variantNameError').textContent='';
    }

    if(!priceRegex.test(price)) {
        document.getElementById('priceError').textContent='Price must be a positive number greater than 0.';
        isValid=false;
    } else {
        document.getElementById('priceError').textContent='';
    }

    if(!colorRegex.test(color)) {
        document.getElementById('colorError').textContent='Color must contain only alphabets and spaces, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('colorError').textContent='';
    }

    if(!stockRegex.test(stock)) {
        document.getElementById('stockError').textContent='Stock must be a positive number greater than 0.';
        isValid=false;
    } else {
        document.getElementById('stockError').textContent='';
    }

    //if(!ramRegex.test(ram)) {
    //    document.getElementById('ramError').textContent='RAM must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
    //    isValid=false;
    //} else {
    //    document.getElementById('ramError').textContent='';
    //}

    //if(!phoneMemoryRegex.test(phoneMemory)) {
    //    document.getElementById('phoneMemoryError').textContent='Phone memory must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
    //    isValid=false;
    //} else {
    //    document.getElementById('phoneMemoryError').textContent='';
    //}

    //if(!sizeRegex.test(size)) {
    //    document.getElementById('sizeError').textContent='Size must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
    //    isValid=false;
    //} else {
    //    document.getElementById('sizeError').textContent='';
    //}

    if(isValid) {
        

        const formData=new FormData(document.getElementById('variantForm'))

        const response=await fetch('/admin/addVariants',{
            method: 'POST',
            body: formData
        })

        const data=await response.json()

        if(!data.success) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Variant name Already Exist",

            });
        } else {
            const result=await Swal.fire({
                icon: "success",
                title: "successful",
                text: "variant added successfully",

            });

            if(result.isConfirmed) {
                window.location.href='/admin/product-details?id='+data.productID
                
            }
        }
    }
});

//Add another Variant form validation

async function addAnotherVariant() {
    const form = document.getElementById('variantForm');

    const variantName=form.querySelector('#variantName').value.trim();
    const price=form.querySelector('#price').value.trim();
    const color=form.querySelector('#color').value.trim();
    const stock=form.querySelector('#stock').value.trim();
    //const ram=form.querySelector('#ram').value.trim();
    //const phoneMemory=form.querySelector('#phoneMemory').value.trim();
    //const size=form.querySelector('#size').value.trim();

    const variantNameRegex=/^[a-zA-Z0-9\s]{3,}$/;
    const priceRegex=/^[1-9]\d*$/;
    const colorRegex=/^[a-zA-Z\s]{4,}$/;
    const stockRegex=/^[1-9]\d*$/;
    //const ramRegex=/^[a-zA-Z0-9\s]{3,}$/;
    //const phoneMemoryRegex=/^[a-zA-Z0-9\s]{3,}$/;
    //const sizeRegex=/^[a-zA-Z0-9\s]{3,}$/;

    let isValid=true;

    if(!variantNameRegex.test(variantName)) {
        document.getElementById('variantNameError').textContent='Variant name must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
        isValid=false;
    } else {
        document.getElementById('variantNameError').textContent='';
    }

    if(!priceRegex.test(price)) {
        document.getElementById('priceError').textContent='Price must be a positive number greater than 0.';
        isValid=false;
    } else {
        document.getElementById('priceError').textContent='';
    }

    if(!colorRegex.test(color)) {
        document.getElementById('colorError').textContent='Color must contain only alphabets and spaces, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('colorError').textContent='';
    }

    if(!stockRegex.test(stock)) {
        document.getElementById('stockError').textContent='Stock must be a positive number greater than 0.';
        isValid=false;
    } else {
        document.getElementById('stockError').textContent='';
    }

    //if(!ramRegex.test(ram)) {
    //    document.getElementById('ramError').textContent='RAM must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
    //    isValid=false;
    //} else {
    //    document.getElementById('ramError').textContent='';
    //}

    //if(!phoneMemoryRegex.test(phoneMemory)) {
    //    document.getElementById('phoneMemoryError').textContent='Phone memory must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
    //    isValid=false;
    //} else {
    //    document.getElementById('phoneMemoryError').textContent='';
    //}

    //if(!sizeRegex.test(size)) {
    //    document.getElementById('sizeError').textContent='Size must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
    //    isValid=false;
    //} else {
    //    document.getElementById('sizeError').textContent='';
    //}

    if(isValid) {
        
        const formData=new FormData(form)

        const response=await fetch('/admin/add-anothervariant',{
            method:'POST',
            body:formData
        })

        const data = await response.json()

        if(!data.success){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Variant name Already Exist",

            });
        }else{
            const result=await Swal.fire({
                icon: "success",
                title: "successful",
                text: "variant added successfully",

            });

            if(result.isConfirmed){
                window.location.href='/admin/addVariants'
            }
        }
    }
}

//EditVariant Form validation


document.getElementById('editVariantForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const variantName=document.getElementById('variantName').value.trim();
    const price=document.getElementById('price').value.trim();
    const color=document.getElementById('color').value.trim();
    const stock=document.getElementById('stock').value.trim();


    const variantNameRegex=/^[a-zA-Z0-9\s]{3,}$/;
    const priceRegex=/^[1-9]\d*$/;
    const colorRegex=/^[a-zA-Z\s]{3,}$/;
    const stockRegex=/^[1-9]\d*$/;


    let isValid=true;

    if(!variantNameRegex.test(variantName)) {
        document.getElementById('variantNameError').textContent='Variant name must contain only alphabets, numbers, and spaces, and must be at least 3 characters long.';
        isValid=false;
    } else {
        document.getElementById('variantNameError').textContent='';
    }

    if(!priceRegex.test(price)) {
        document.getElementById('priceError').textContent='Price must be a positive number greater than 0.';
        isValid=false;
    } else {
        document.getElementById('priceError').textContent='';
    }

    if(!colorRegex.test(color)) {
        document.getElementById('colorError').textContent='Color must contain only alphabets and spaces, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('colorError').textContent='';
    }

    if(!stockRegex.test(stock)) {
        document.getElementById('stockError').textContent='Stock must be a positive number greater than 0.';
        isValid=false;
    } else {
        document.getElementById('stockError').textContent='';
    }



    if(isValid) {

        this.submit();


        //const formData=new FormData(document.getElementById('editVariantForm'))
        //const variantId = '<%= variant._id %>'
        //console.log(variantId);
        //const url = `/admin/edit-variant?id=${variantId}`;
        //const response=await fetch(url,{
        //    method: 'P0ST',
        //    body: formData
        //})

        //const data=await response.json()

        //if(!data.success) {
        //    Swal.fire({
        //        icon: "error",
        //        title: "Oops...",
        //        text: "Variant name Already Exist",

        //    });
        //} else {
        //    const result=await Swal.fire({
        //        icon: "success",
        //        title: "successful",
        //        text: "variant updated successfully",

        //    });

        //    if(result.isConfirmed) {
        //        console.log(data.productId);
        //        window.location.href='/admin/product-details? id='+data.productId

        //    }
        //}
    }
});

