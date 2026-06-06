document.addEventListener("DOMContentLoaded", () => {
    const btnContato = document.getElementById("btnContato");

    if (btnContato) {
        btnContato.addEventListener("click", () => {

            const email = "tavares.rosana@escola.pr.gov.br";
            const assunto = encodeURIComponent("Contato sobre o site AgroTech Sustentável");

const mensagem = encodeURIComponent(
`Olá,

Estou entrando em contato sobre o site AgroTech Sustentável.

Mensagem:
`
);

           window.open(
`mailto:${email}?subject=${assunto}&body=${mensagem}`,
"_blank"
           )
        });
    }
});
