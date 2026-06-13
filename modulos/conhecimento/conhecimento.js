document.addEventListener('DOMContentLoaded', () => {

    // FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {

            const currentItem = question.parentElement;

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                }
            });

            currentItem.classList.toggle('active');
        });
    });

    // Botão Fazer Pergunta
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.btn-search');

    if (searchButton && searchInput) {

        searchButton.addEventListener('click', () => {

            const pergunta = searchInput.value.trim();

            if (pergunta !== "") {

                const email = "tavares.rosana@escola.pr.gov.br";

                const assunto = encodeURIComponent(
                    "Contato sobre o site AgroVision Sustentável - Base de Conhecimento"
                );

                const mensagem = encodeURIComponent(
`Olá,

Estou entrando em contato pela Base de Conhecimento do site AgroVision Sustentável.

Pergunta:
${pergunta}
`
                );

                window.open(
                    `mailto:${email}?subject=${assunto}&body=${mensagem}`,
                    "_blank"
                );

            } else {
                alert("Digite uma pergunta.");
            }

        });

        // Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // FECHAR MODAL
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");

    if(closeModal){

        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (e) => {

            if(e.target === modal){
                modal.style.display = "none";
            }

        });
    }

});


// ABRIR MODAL
function openModal(key){

    const modal = document.getElementById("modal");

    document.getElementById("modalTitle").textContent =
    conteudos[key].title;

    document.getElementById("modalImage").src =
    conteudos[key].image;

    document.getElementById("modalText").innerHTML =
    conteudos[key].text;

    modal.style.display = "flex";
}