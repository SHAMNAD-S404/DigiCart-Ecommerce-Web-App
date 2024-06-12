
document.getElementById('catSubmit').addEventListener('submit', async function(event){
            event.preventDefault()
  
        const categoryName=document.getElementById('categoryName').value.trim();
        const description=document.getElementById('description').value.trim();

        const regex=/^[a-zA-Z]+\s?[a-zA-Z\s]*[a-zA-Z]+$/;
        const minLength=4;

        let isValid =true

        if(!regex.test(categoryName)||categoryName.length<minLength) {
            document.getElementById('categoryError').textContent='Category title must contain only alphabets and spaces, and must be at least 4 characters long.';
            isValid = false;
        } else {
            document.getElementById('categoryError').textContent='';
        }

        if(!regex.test(description)||description.length<minLength) {
            document.getElementById('descriptionError').textContent='Description must contain only alphabets and spaces, and must be at least 4 characters long.';
            isValid = false;
        } else {
            document.getElementById('descriptionError').textContent='';
        }

        if(isValid){
         
            
            const formData = new FormData(this)

            const response = await fetch('/admin/add_category',{
                method:"POST",
                body:formData
            })

             const data = await response.json()
           

             if(!data.success){
                 Swal.fire({
                     icon: "error",
                     title: "Oops...",
                     text: "Category Already Exist",
                     
                 });
             }else{
                const result = await Swal.fire({
                     icon: "success",
                     title: "successful",
                     text: "Category added successfully",
                     
                 });

                 if(result.isConfirmed){
                     window.location.href= '/admin/category_management'
                 }
             }
        }

})