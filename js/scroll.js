window.addEventListener('scroll',()=>{

    const header =
    document.querySelector('.header');

    if(window.scrollY > 50){

        header.style.background =
        'rgba(255,255,255,0.96)';

        header.style.boxShadow =
        '0 5px 20px rgba(0,0,0,0.08)';

    }else{

        header.style.background =
        'rgba(255,255,255,0.08)';

        header.style.boxShadow =
        'none';
    }
    function irParaSimulador() {
  window.location.href = "pages/simulador.html";
}
});
