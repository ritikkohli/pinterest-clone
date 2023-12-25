let icon = document.querySelector('.edit-icon');
let form = document.querySelector('#formupload')
let input = document.querySelector('#formupload input');
icon.addEventListener('click', function(){
    input.click();
    input.addEventListener('change',function(){
        form.submit();
    })
})

document.querySelector('#pin-box').addEventListener('click',function(){
    document.querySelector('#mypins-link').click();
})
