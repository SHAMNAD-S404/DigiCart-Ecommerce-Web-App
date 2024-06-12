// Function to handle file selection
document.getElementById('image-upload').addEventListener('change',function (event) {
    const file=event.target.files[0];
    if(!file) return;

    // Display preview thumbnail
    const reader=new FileReader();
    reader.onload=function (e) {
        const previewContainer=document.getElementById('preview-container');
        const img=document.createElement('img');
        img.src=e.target.result;
        img.style.maxWidth='30%';
        img.style.marginTop='10px';
        img.style.borderRadius='20px';
        img.style.marginBottom='15px';
        previewContainer.innerHTML='';
        previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
});