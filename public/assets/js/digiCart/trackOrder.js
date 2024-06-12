function backToOrders(){
    window.location.href='/orders';
}



//******************************************************************************************************************** */
//PDF DOWNLOAD


    document.getElementById('downloadInvoice').addEventListener('click',function () {
        const element=document.getElementById('invoiceContent');


        const Toast=Swal.mixin({
            toast: true,
            position: 'bottom',
            iconColor: 'white',
            customClass: {
                popup: 'colored-toast',
            },
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
        });
        (async () => {
            await Toast.fire({
                icon: 'success',
                title: 'Downloading Invoice...',
            })
        })();

    var opt={
        margin: [0.5,0.5,0.5,0.5], // Top, right, bottom, left margins
    filename: 'invoice.pdf',
    image: {type: 'jpeg',quality: 0.98},
    html2canvas: {scale: 2},
    jsPDF: {unit: 'in',format: 'a4',orientation: 'landscape'} // Change to landscape for wider format
        };
        html2pdf().set({
            pagebreak: {before: '.beforeClass',after: ['#after1','#after2'],avoid: 'img'}
        });

    html2pdf().from(element).set(opt).save();
    });

//******************************************************************************************************************** */

//APPENDIN CURRENT DATE 

function formatDate(date) {
    const options={year: 'numeric',month: 'long',day: 'numeric'};
    return date.toLocaleDateString('en-US',options);
}

function formatTime(date) {
    const options={hour: '2-digit',minute: '2-digit',second: '2-digit'};
    return date.toLocaleTimeString('en-US',options);
}

document.addEventListener('DOMContentLoaded',function () {
    const now=new Date();
    document.getElementById('invoiceDate').textContent=formatDate(now);
    document.getElementById('invoiceTime').textContent=formatTime(now);

    //STATUS AND INVOICE BUTTON
    const invoiceButton=document.getElementById('downloadInvoice')
    const statusElement=document.querySelectorAll('.statusOFproduct')

    statusElement.forEach((span) => {
        let status=span.textContent.trim()


        if(status==='Pending Payment') {
            invoiceButton.style.display='none'
        } else if(status==='Cancelled') {
            invoiceButton.style.display='none'
        } else if(status==='Shipped') {
            invoiceButton.style.display='none'
        } else if(status==='Processing') {
            invoiceButton.style.display='none'
        }

    })
});

//******************************************************************************************************************** */

