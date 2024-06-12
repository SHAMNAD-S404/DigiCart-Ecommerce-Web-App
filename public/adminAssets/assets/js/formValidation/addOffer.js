
//* *************************************************************************************************************************
//ONLOAD FUNCTION

    document.addEventListener('DOMContentLoaded',()=>{
        const productDIV = document.getElementById('selectProductDiv')
        const categoryDIV = document.getElementById('selectCategoryDiv')

        productDIV.style.display = 'none'
        categoryDIV.style.display = 'none'
    })


//* *************************************************************************************************************************
//AFTER SELECT OFFER TYPE

    document.getElementById('selectOfferType').addEventListener('change',function(){

        const selectedOffer = this.value;
        const productDIV =  document.getElementById('selectProductDiv')
        const categoryDIV = document.getElementById('selectCategoryDiv')


        if(selectedOffer ==='Product Offer') {
            productDIV.style.display = 'block';
            categoryDIV.style.display = 'none';
            
        } else if(selectedOffer ==='Category Offer') {
            categoryDIV.style.display ='block';
            productDIV.style.display  = 'none';

        }else{
            Swal.fire({
                text: "Select One",
                icon: "warning"
            });
        }
        
    })


//* *************************************************************************************************************************
//ADD OFFER 

 async function addOffer(){
    try {

        //FETCH VALUES FROM ELEMENTS
        const offerName = document.getElementById('offerName').value
        const offerDescription=document.getElementById('offerDescription').value
        const DPercentage=document.getElementById('DPercentage').value
        const datePicker=document.getElementById('datePicker').value
        const selectOfferType=document.getElementById('selectOfferType').value

        //FETCH OPTION VALUE AND TEXT 
        const selectProductID = document.getElementById('selctProduct')
        const selectProduct   = selectProductID.value
        const ProductName     = selectProductID.options[selectProductID.selectedIndex].textContent
        
        const selectCategoryID = document.getElementById('selectCategory')
        const selectCategory   = selectCategoryID.value
        const CategoryName     = selectCategoryID.options[selectCategoryID.selectedIndex].textContent

        //SELECT OPTION TEXT CONTENT
        const appliedItems = selectOfferType ==='Product Offer' ? ProductName : CategoryName;

      
        //REGEX PATTERN FOR CHECKING
        const nameRegex=/^[A-Za-z0-9][A-Za-z0-9 ]{2,20}[A-Za-z0-9]$/
        const discriptionRegex=/^[a-zA-Z0-9][a-zA-Z0-9 ]{4,60}[a-zA-Z0-9]$/;
        const discountRegex=/^(10|[1-6][0-9]|70)$/
        const dateRegex=/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/


        //ERROR SPAN TAGS
        const offerNameError = document.getElementById('offerNameError')
        const offerDescriptionError=document.getElementById('offerDescriptionError')
        const discountError=document.getElementById('discountError')
        const dateError=document.getElementById('dateError')

        //VALIDATION CHECKING
        let isValid = true;

        if(!nameRegex.test(offerName)) {
            offerNameError.textContent='Enter Valid offer name! its only contain alphabtes and numbers';
            isValid=false;
        } else {
           offerNameError.textContent='';
        }
        if(!discriptionRegex.test(offerDescription)) {
            offerDescriptionError.textContent='its only contain alphabets and numbers . its need atleast 6 character ';
            isValid=false;
        } else {
           offerDescriptionError.textContent='';
        }
        if(!discountRegex.test(DPercentage)) {
            discountError.textContent='Enter a Number only between 10-70.';
            isValid=false;
        } else {
           discountError.textContent='';
        }
        if(!dateRegex.test(datePicker)) {
            dateError.textContent='Enter a valid date';
            isValid=false;
        } else {
           dateError.textContent='';
        }

        //EXPIRY DATE CHECKING
        function compareDates(selectedDateValue) {
            const today=new Date().setHours(0,0,0,0); 
            const [day,month,year]=selectedDateValue.split('-').map(Number); 
            const selectedDate=new Date(year,month-1,day).setHours(0,0,0,0); 

            if(today===selectedDate) {
                dateError.textContent='Select a future Date';
                isValid=false;
            } else {
                dateError.textContent='';
            }
        }

        compareDates(datePicker);

        //SENDING TO SERVER
        if (isValid && selectOfferType !== null) {

            const offerDetails = {
                offerType : selectOfferType,
                offerItem : selectOfferType==='Product Offer'? selectProduct:selectCategory,
                name : offerName,
                discription: offerDescription,
                percentage : DPercentage,
                expiryDate : datePicker,
                applicableItems : appliedItems


            }

           const response = await fetch('/admin/add-offer',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(offerDetails)
           })

           if (response.redirected) {
            return window.location.href=response.url
           }

           const data = await response.json()

           if (data.success) {

               Swal.fire({
                   text: data.success||"Success",
                   icon: "success"
               }).then(()=>{
                    return window.location.href ='/admin/offers'
               })
            
           }else if(data.error){
               Swal.fire({
                   text: data.error||"Failed",
                   icon: "error"
               });

           }
           
            
            
        }else{
            Swal.fire({
                text: "Fill the form correctly",
                icon: "error"
            });
        }
        
    } catch (error) {
        console.error(error);
    }
 }


//* *************************************************************************************************************************