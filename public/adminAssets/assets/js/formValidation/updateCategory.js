document.getElementById('updateCategory').addEventListener('submit', async (event)=>{
    event.preventDefault()

    const categoryName=document.getElementById('categoryName').value.trim();
    const description=document.getElementById('description').value.trim();

    const regex=/^[a-zA-Z]+\s?[a-zA-Z\s]*[a-zA-Z]+$/;
    const minLength=4;

    let isValid=true

    if(!regex.test(categoryName)||categoryName.length<minLength) {
        document.getElementById('categoryError').textContent='Category title must contain only alphabets and spaces, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('categoryError').textContent='';
    }

    if(!regex.test(description)||description.length<minLength) {
        document.getElementById('descriptionError').textContent='Description must contain only alphabets and spaces, and must be at least 4 characters long.';
        isValid=false;
    } else {
        document.getElementById('descriptionError').textContent='';
    }

    if(isValid) {

        const form=document.getElementById('updateCategory');
        const formData=new FormData(form)

        const response=await fetch('/admin/edit-category',{
            method: "PATCH",
            body: formData
        })

        const data=await response.json()


        if(!data.success) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Category name Already Exist",

            });
        } else {
            const result=await Swal.fire({
                icon: "success",
                title: "successful",
                text: "Category Updated successfully",

            });

            if(result.isConfirmed) {
                window.location.href='/admin/category_management'
            }
        }
    }
})