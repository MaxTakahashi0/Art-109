const popupNotice = document.querySelector('.popup-notice');

popupNotice.addEventListener('click', () => {
  popupNotice.classList.toggle('hidden');
});




function randomPopups() {
    let popupAmount = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < popupAmount; i++) {
        openWindow();
    }
}

function openWindow() {
        let w = 200, h = 200;

    let left = Math.random() * (screen.availWidth - w);
    let top = Math.random() * (screen.availHeight - h);

    window.open("popups.html", "_blank",
        `width=${w},height=${h},left=${left},top=${top}`);
}


// function openWindow() {
//     var i, l, options = [{
//        value: 'first',
//        text: 'First'
//     }, {
//        value: 'second',
//        text: 'Second'
//     }],
//     newWindow = window.open("", null, "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");  

//     newWindow.document.write("<select onchange='window.opener.setValue(this.value);'>");
//     for(i=0,l=options.length; i<l; i++) {
//         newWindow.document.write("<option value='"+options[i].value+"'>");  
//         newWindow.document.write(options[i].text);  
//         newWindow.document.write("</option>");
//     }
//     newWindow.document.write("</select>");

// }

// function setValue(value) {
//     document.getElementById('value').value = value;
// }



