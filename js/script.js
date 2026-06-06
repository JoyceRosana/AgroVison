// FADE

const fadeElements =
document.querySelectorAll('.fade-up');

const observer =
new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

        if(entry.isIntersecting){

            entry.target.classList.add('show');
        }

    });

},{
    threshold:0.2
});

fadeElements.forEach((el)=>{

    observer.observe(el);
});

// SCROLL BUTTON

const scrollButton =
document.querySelector('.scroll-down');

window.addEventListener('scroll',()=>{

    if(window.scrollY > 120){

        scrollButton.classList.add('hide');

    }else{

        scrollButton.classList.remove('hide');
    }

    function irParaSimulador() {
  window.location.href = "pages/simulador.html";
}

});
