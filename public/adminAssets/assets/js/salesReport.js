

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

const pdfButton=document.getElementById('toPDF');

document.addEventListener('DOMContentLoaded',function () {
    function formatDate(date) {
        const options={year: 'numeric',month: 'long',day: 'numeric'};
        return date.toLocaleDateString('en-US',options);
    }

    function formatTime(date) {
        const options={hour: '2-digit',minute: '2-digit',second: '2-digit'};
        return date.toLocaleTimeString('en-US',options);
    }

    const now=new Date();
    document.getElementById('currentDate').textContent=formatDate(now);
    document.getElementById('currentTime').textContent=formatTime(now);

    pdfButton.addEventListener('click',function () {
        var element=document.getElementById('pdfContent');
        var opt={
            margin: [0.5,0.5,0.5,0.5],
            filename: 'sales_report.pdf',
            image: {type: 'jpeg',quality: 0.98},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in',format: [11,17],orientation: 'landscape'} // Using tabloid size
        };

        html2pdf().from(element).set(opt).save();
    });
});

//pdfButton.addEventListener('click',() => {
//    const table=document.querySelector('#ayne_ne_ethaa');
//    const rows=Array.from(table.querySelectorAll('tr'));
//    const data=rows.map(row => {
//        const cells=row.querySelectorAll('td');
//        return Array.from(cells).map(cell => cell.innerText);
//    });

//    const doc = new jsPDF()

//    doc.text('DigiCart Ecom',10,10);
//    doc.text('Sales Report',10,20);
//    doc.autoTable({
//        startY: 30,
//        head: [['ORDER ID','ORDER DATE','PRODUCT','CUSTOMER','PAYMENT MODE','STATUS','OFFER DISCOUNT','COUPON DISCOUNT','FINAL CART PRICE']],
//        body: data,
//    });

//    doc.save('sales_report.pdf');
//});

    //pdfButton.addEventListener('click',function () {
    //    const element=document.getElementById('pdfConvert');

    //    var opt={
    //        margin: [0.5,0.5,0.5,0.5], // Top, right, bottom, left margins
    //        filename: 'invoice.pdf',
    //        image: {type: 'jpeg',quality: 0.98},
    //        html2canvas: {scale: 2},
    //        jsPDF: {unit: 'in',format: 'a4',orientation: 'landscape'} // Change to landscape for wider format
    //    };
    //    html2pdf().set({
    //        pagebreak: {before: '.beforeClass',after: ['#after1','#after2'],avoid: 'img'}
    //    });

    //    html2pdf().from(element).set(opt).save();
    //});





