
////SEARCH FUNCTION

//const searchButton=document.getElementById('headerSearchButton')
//const headerSearchInput=document.getElementById('headerSearchInput')

//searchButton.addEventListener('click',()=>{
//    const search = headerSearchInput.value

//    window.location.href=`/shopall?search=${search}`

 
//})


//CATEGORY FILTER 

 function categoryFilter(categoryName){
     window.location.href=`/shopall?search=${categoryName}`
 }

 //SORTING FUNCTION

  const select = document.getElementById('sortingFunctions')
  select.addEventListener('change',(event)=>{
    const selectedValue = event.target.value
    window.location.href=`/shopall?sort=${selectedValue}`

  })