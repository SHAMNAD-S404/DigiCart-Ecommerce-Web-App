document.getElementById('editVariantForm').addEventListener('submit',function (event) {
    event.preventDefault();

    const variantName=document.getElementById('variantName').value.trim();
    const price=document.getElementById('price').value.trim();
    const color=document.getElementById('color').value.trim();
    const stock=document.getElementById('stock').value.trim();


    const variantNameRegex=/^[a-zA-Z0-9\s]{2,}$/;
    const priceRegex=/^[1-9]\d*$/;
    const colorRegex=/^[a-zA-Z\s]{3,}$/;
    const stockRegex=/^[0-9]\d*$/;


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


    }
});