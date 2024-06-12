document.getElementById('image-upload1').addEventListener('change',handleFileSelect);
document.getElementById('image-upload2').addEventListener('change',handleFileSelect);
document.getElementById('image-upload3').addEventListener('change',handleFileSelect);

function handleFileSelect(event) {
    const file=event.target.files[0];
    const previewContainerId=`preview-container${event.target.id.slice(-1)}`;
    if(!file) return;

    const reader=new FileReader();
    reader.onload=function (e) {
        const previewContainer=document.getElementById(previewContainerId);
        const img=document.createElement('img');
        img.src=e.target.result;
        img.style.maxWidth='30%';
        img.style.marginTop='10px';
        previewContainer.innerHTML='';
        previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
}
