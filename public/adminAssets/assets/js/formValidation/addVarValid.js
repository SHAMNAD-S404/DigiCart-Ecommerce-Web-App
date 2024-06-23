
//****************************************************************************************************************** */

//IMAGE PREVIEW FUNCTION 


//document.getElementById('image-upload-1').addEventListener('change',function () {
//    previewImage(this,'image1Preview');
//});

//document.getElementById('image-upload-2').addEventListener('change',function () {
//    previewImage(this,'image2Preview');
//});

//document.getElementById('image-upload-3').addEventListener('change',function () {
//    previewImage(this,'image3Preview');
//});

//function previewImage(input,previewElementId) {
//    const file=input.files[0];
//    if(file) {
//        const reader=new FileReader();
//        reader.onload=function (e) {
//            const previewElement=document.getElementById(previewElementId);
//            previewElement.innerHTML=`<img src="${e.target.result}" alt="Image Preview" style="max-width: 40%; height: auto;"/>`;
//        };
//        reader.readAsDataURL(file);
//    }
//}





//****************************************************************************************************************** */

document.getElementById('SubmitButton').addEventListener('click',async function (event) {
  
    event.preventDefault();

    const variantName=document.getElementById('variantName').value.trim();
    const price=document.getElementById('price').value.trim();
    const color=document.getElementById('color').value.trim();
    const stock=document.getElementById('stock').value.trim();
   
    //let ram=document.getElementById('ram') != null ? ram.value.trim() : '' ;
    //let phoneMemory=document.getElementById('phoneMemory') != null ? phoneMemory.value.trim() : '';
    //const size=document.getElementById('size').value.trim();
   
    //GETTING IMAGES
    const image1=document.getElementById('image-upload-1').files[0];
    const image2=document.getElementById('image-upload-2').files[0];
    const image3=document.getElementById('image-upload-3').files[0];

    const files=[image1,image2,image3];


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

    //IMAGE VALIDATION 

    if(!image1) {
        document.getElementById('image1Error').innerText='Please upload image 1.';
        valid=false;
    } else {
        document.getElementById('image1Error').innerText='';
    }

    if(!image2) {
        document.getElementById('image2Error').innerText='Please upload image 2.';
        valid=false;
    } else {
        document.getElementById('image2Error').innerText='';
    }

    if(!image3) {
        document.getElementById('image3Error').innerText='Please upload image 3.';
        valid=false;
    } else {
        document.getElementById('image3Error').innerText='';
    }

 

    //IMAGE MEME TYP CHECKING

    for(let i=0;i<files.length;i++) {

        if(!['image/jpeg','image/png','image/jpg'].includes(files[i].type)) {

            document.getElementById(`image${[i+1]}Error`).textContent='Only JPEG and PNG images are allowed..';
            Swal.fire({
                text: "Only JPEG and PNG images are allowed.",
                icon: "warning"
            });
            isValid=false;
        }else{
            document.getElementById(`image${[i+1]}Error`).textContent=''; 
        }
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

//****************************************************************************************************************** */

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

    //GETTING IMAGES
    const image1=document.getElementById('image-upload-1').files[0];
    const image2=document.getElementById('image-upload-2').files[0];
    const image3=document.getElementById('image-upload-3').files[0];

    const files=[image1,image2,image3];

    //REGEX VALIDATION
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

    //IMAGE VALIDATION 

    if(!image1) {
        document.getElementById('image1Error').innerText='Please upload image 1.';
        isValid=false;
    } else {
        document.getElementById('image1Error').innerText='';
    }

    if(!image2) {
        document.getElementById('image2Error').innerText='Please upload image 2.';
        isValid=false;
    } else {
        document.getElementById('image2Error').innerText='';
    }

    if(!image3) {
        document.getElementById('image3Error').innerText='Please upload image 3.';
        isValid=false;
    } else {
        document.getElementById('image3Error').innerText='';
    }

    //IMAGE MEME TYP CHECKING

    for(let i=0;i<files.length;i++) {

        if(!['image/jpeg','image/png','image/jpg'].includes(files[i].type)) {

            document.getElementById(`image${[i+1]}Error`).textContent='Only JPEG and PNG images are allowed..';
            Swal.fire({
                text: "Only JPEG and PNG images are allowed.",
                icon: "warning"
            });
            isValid=false;
        } else {
            document.getElementById(`image${[i+1]}Error`).textContent='';
        }
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


