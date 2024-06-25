/******************************************************************************************************************** */
//ADD COUPON

 async function addCoupon(){
    try {

        const couponCode         = document.getElementById('couponCode').value
        const discription        = document.getElementById('description').value
        const discountPercentage = document.getElementById('DPercentage').value
        const minPurchaseAmount  = document.getElementById('minAmt').value
        const maxDiscountAmount  = document.getElementById('maxAmt').value
        const expiryDate         = document.getElementById('datePicker').value

        const couponCodeSpan         = document.getElementById('couponCodeError')
        const discriptionSpan        = document.getElementById('descriptionError')
        const discountPercentageSpan = document.getElementById('discountError')
        const minPurchaseAmountSpan  = document.getElementById('minError')
        const maxDiscountAmountSpan  = document.getElementById('maxError')
        const expiryDateSpan         = document.getElementById('dateError')

        const couponRegex= /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}; ':"\\|,.<>/?]{4,15}$/
        const discriptionRegex=/^[a-zA-Z0-9][a-zA-Z0-9 ]{4,60}[a-zA-Z0-9]$/;
        const discountRegex=/^(10|[1-6][0-9]|70)$/
        const amountRegex=/^[1-9][0-9]*$/
        const dateRegex=/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/

        let isValid = true;

        if(!couponRegex.test(couponCode)) {
            couponCodeSpan.textContent='Enter Valid Coupon code! its only contain string and numbers';
            isValid=false;
        } else {
           couponCodeSpan.textContent='';
        }
        if(!discriptionRegex.test(discription)) {
            discriptionSpan.textContent='its only contain alphabets and numbers . its need atleast 6 character ';
            isValid=false;
        } else {
           discriptionSpan.textContent='';
        }
        if(!discountRegex.test(discountPercentage)) {
            discountPercentageSpan.textContent='Enter a Number only between 10-70.';
            isValid=false;
        } else {
           discountPercentageSpan.textContent='';
        }
        if(!amountRegex.test(minPurchaseAmount)) {
            minPurchaseAmountSpan.textContent='Enter a valid Amount';
            isValid=false;
        } else {
           minPurchaseAmountSpan.textContent='';
        }
        if(!amountRegex.test(maxDiscountAmount)) {
            maxDiscountAmountSpan.textContent='Enter a valid Amount';
            isValid=false;
        } else {
           maxDiscountAmountSpan.textContent='';
        }
        if(!dateRegex.test(expiryDate)) {
            expiryDateSpan.textContent='Enter a valid Date';
            isValid=false;
        } else {
           expiryDateSpan.textContent='';
        }

        function compareDates(selectedDateValue) {
            const today=new Date().setHours(0,0,0,0); 
            const [day,month,year]=selectedDateValue.split('-').map(Number); 
            const selectedDate=new Date(year,month-1,day).setHours(0,0,0,0); 

            if(today===selectedDate) {
                expiryDateSpan.textContent='Select a future Date';
                isValid=false;
            } else {
                expiryDateSpan.textContent='';
            }
        }

        compareDates(expiryDate);

        if(isValid){
            
            const response = await fetch('/admin/add-coupon',{
                method : 'POST',
                headers : {'Content-type':'application/json'},
                body : JSON.stringify({

                    couponCode : couponCode,
                    discription : discription,
                    discountPercentage:discountPercentage,
                    minPurchaseAmount:minPurchaseAmount,
                    maxDiscountAmount: maxDiscountAmount,
                    expiryDate : expiryDate

                })
            })

            if(response.redirected){
                return window.location.href=response.url
            }

            const data = await response.json()

            if (data.success) {
                
                    Swal.fire({
                        icon: "success",
                        text: data.success||"Success!",
                        footer: `<a href="/admin/all-coupon">Go to Coupon</a>`
                    }).then(()=>{
                        return window.location.reload()
                    })
           
                
                
            }else if(data.error){
                Swal.fire({
                    icon: "error",
                    text: data.error||"Failed",
                });

            }
        }


        
    } catch (error) {
        console.error(error);
    }
 }




/******************************************************************************************************************** */
//EDIT COUPON

async function editCoupon(couponID) {
    try {

        const couponCode=document.getElementById('couponCode').value
        const discription=document.getElementById('description').value
        const discountPercentage=document.getElementById('DPercentage').value
        const minPurchaseAmount=document.getElementById('minAmt').value
        const maxDiscountAmount=document.getElementById('maxAmt').value
        let expiryDate;
        const secondExpiryDate=document.getElementById('secondExpiryDate').value   
        const mainExpiryDate=document.getElementById('datePicker').value
        
        if (mainExpiryDate) {
            expiryDate=mainExpiryDate
        }else{
            expiryDate=secondExpiryDate
        }
       

        const couponCodeSpan=document.getElementById('couponCodeError')
        const discriptionSpan=document.getElementById('descriptionError')
        const discountPercentageSpan=document.getElementById('discountError')
        const minPurchaseAmountSpan=document.getElementById('minError')
        const maxDiscountAmountSpan=document.getElementById('maxError')
        const expiryDateSpan=document.getElementById('dateError')

        const couponRegex=/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}; ':"\\|,.<>/?]{6}$/
        const discriptionRegex=/^[a-zA-Z0-9][a-zA-Z0-9 ]{4,60}[a-zA-Z0-9]$/;
        const discountRegex=/^(10|[1-6][0-9]|70)$/
        const amountRegex=/^[1-9][0-9]*$/
        const dateRegex=/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/

        let isValid=true;

        if(!couponRegex.test(couponCode)) {
            couponCodeSpan.textContent='Enter Valid Coupon code! its only contain string and numbers';
            isValid=false;
        } else {
            couponCodeSpan.textContent='';
        }
        if(!discriptionRegex.test(discription)) {
            discriptionSpan.textContent='its only contain alphabets and numbers . its need atleast 6 character ';
            isValid=false;
        } else {
            discriptionSpan.textContent='';
        }
        if(!discountRegex.test(discountPercentage)) {
            discountPercentageSpan.textContent='Enter a Number only between 10-70.';
            isValid=false;
        } else {
            discountPercentageSpan.textContent='';
        }
        if(!amountRegex.test(minPurchaseAmount)) {
            minPurchaseAmountSpan.textContent='Enter a valid Amount';
            isValid=false;
        } else {
            minPurchaseAmountSpan.textContent='';
        }
        if(!amountRegex.test(maxDiscountAmount)) {
            maxDiscountAmountSpan.textContent='Enter a valid Amount';
            isValid=false;
        } else {
            maxDiscountAmountSpan.textContent='';
        }
        if(!dateRegex.test(expiryDate)) {
            expiryDateSpan.textContent='Enter a valid Date';
            isValid=false;
        } else {
            expiryDateSpan.textContent='';
        }

        function compareDates(selectedDateValue) {
            const today=new Date().setHours(0,0,0,0);
            const [day,month,year]=selectedDateValue.split('-').map(Number);
            const selectedDate=new Date(year,month-1,day).setHours(0,0,0,0);

            if(today===selectedDate) {
                expiryDateSpan.textContent='Select a future Date';
                isValid=false;
            } else {
                expiryDateSpan.textContent='';
            }
        }

        compareDates(expiryDate);

        if(isValid) {

            const response=await fetch('/admin/edit-coupon',{
                method: 'PATCH',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    
                    couponID :couponID,
                    couponCode: couponCode,
                    discription: discription,
                    discountPercentage: discountPercentage,
                    minPurchaseAmount: minPurchaseAmount,
                    maxDiscountAmount: maxDiscountAmount,
                    expiryDate: expiryDate

                })
            })

            if(response.redirected) {
                return window.location.href=response.url
            }

            const data=await response.json()

            if(data.success) {

                Swal.fire({
                    icon: "success",
                    text: data.success||"Success!",
                }).then(() => {
                    return window.location.href='/admin/all-coupon'
                })



            } else if(data.error) {
                Swal.fire({
                    icon: "error",
                    text: data.error||"Failed",
                });

            }
        }



    } catch(error) {
        console.error(error);
    }
}




/******************************************************************************************************************** */
