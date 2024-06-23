

//?***********************************************************************************************************************************************?


// TO SHOW AND HIDE CALENDAR INPUT

function showDatePicker(){
    const calendar = document.getElementById('datePicker')
    const searchButton = document.getElementById('searchButton')
    calendar.style.display==='block'? calendar.style.display='none' : calendar.style.display='block'
    searchButton.style.display==='block'? searchButton.style.display='none' : searchButton.style.display='block'
}

//?***********************************************************************************************************************************************?
//DATE FORM SUBMISSION

    const searchButton=document.getElementById('searchButton')
    searchButton.addEventListener('click',()=>{

        const calendar=document.getElementById('datePicker').value
        if (!calendar) {

            Swal.fire({
                text: "Pick two dates",
                icon: "warning"
            });
            
        }else{

            return window.location.href=`/admin/sales-report-filter?filter=custom&date=${calendar}`
        }
        


    })

    //?*********************************************************************************************************************************************?

    //TO EXCEL CONVERT 

    //   const excelButton = document.getElementById('toExcel')
       
    //   excelButton.addEventListener('click',()=>{

    //       const table=document.querySelector('#ayne_ne_ethaa');
    //       const rows=Array.from(table.querySelectorAll('tr'));
    //       const data=rows.map(row => {
    //           const cells=row.querySelectorAll('td');
    //           return Array.from(cells).map(cell => cell.innerText);
    //       });

    //       const worksheet=XLSX.utils.aoa_to_sheet([
    //           ['DigiCart Ecom'],
    //           ['Sales Report'],
    //           [],
    //           ['ORDER ID','ORDER DATE','PRODUCT','CUSTOMER','PAYMENT MODE','STATUS','OFFER DISCOUNT','COUPON DISCOUNT','FINAL CART PRICE'],
    //           ...data
    //       ]);

    //       const workbook=XLSX.utils.book_new();
    //       XLSX.utils.book_append_sheet(workbook,worksheet,'Sales Report');
    //       XLSX.writeFile(workbook,'sales_report.xlsx');
    //   })


const excelButton=document.getElementById('toExcel');

excelButton.addEventListener('click',() => {
    const table=document.querySelector('#ayne_ne_ethaa');
    const rows=Array.from(table.querySelectorAll('tr'));
    const data=rows.map(row => {
        const cells=row.querySelectorAll('td');
        return Array.from(cells).map(cell => cell.innerText);
    });

    const headerStyle={bold: true,fontSize: 16,horizontalAlignment: 'center'};

    // Create a new workbook
    const workbook=XLSX.utils.book_new();

    // Create a worksheet for the data
    const worksheet=XLSX.utils.aoa_to_sheet([
        ['DigiCart Ecom'],
        ['Sales Report'],
        [],
        ['ORDER ID','ORDER DATE','PRODUCT','CUSTOMER','PAYMENT MODE','STATUS','OFFER DISCOUNT','COUPON DISCOUNT','FINAL CART PRICE'],
        ...data
    ]);

    // Apply the style to the header rows
    worksheet['A1'].s=headerStyle; // DigiCart Ecom
    worksheet['A2'].s=headerStyle; // Sales Report

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook,worksheet,'Sales Report');

    // Generate and download the Excel file
    XLSX.writeFile(workbook,'sales_report.xlsx');
});



//?***********************************************************************************************************************************************?

//TO PDF FORMAT DOWNLOAD FUNCTION

//const pdfButton=document.getElementById('toPDF');

//document.addEventListener('DOMContentLoaded',function () {
//    function formatDate(date) {
//        const options={year: 'numeric',month: 'long',day: 'numeric'};
//        return date.toLocaleDateString('en-US',options);
//    }

//    function formatTime(date) {
//        const options={hour: '2-digit',minute: '2-digit',second: '2-digit'};
//        return date.toLocaleTimeString('en-US',options);
//    }

//    const now=new Date();
//    document.getElementById('currentDate').textContent=formatDate(now);
//    document.getElementById('currentTime').textContent=formatTime(now);

//    pdfButton.addEventListener('click',function () {
//        var element=document.getElementById('pdfContent');
//        var opt={
//            margin: [0.5,0.5,0.5,0.5],
//            filename: 'sales_report.pdf',
//            image: {type: 'jpeg',quality: 0.98},
//            html2canvas: {scale: 2},
//            jsPDF: {unit: 'in',format: [11,17],orientation: 'landscape'} // Using tabloid size
//        };

//        html2pdf().from(element).set(opt).save();
//    });
//});

async function downloadPDF() {
    const urlParams=new URLSearchParams(window.location.search);
    const response=await fetch(`/admin/download-sales-report-pdf?${urlParams.toString()}`);
    const blob=await response.blob();
    const url=window.URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='sales_report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

}







