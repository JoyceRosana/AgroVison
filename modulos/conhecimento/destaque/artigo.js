document.addEventListener("DOMContentLoaded", () => {

    // MENU CONHECIMENTO
    const menuConhecimento = document.getElementById("menuConhecimento");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const seta = document.getElementById("seta");

    if (menuConhecimento && dropdownMenu && seta) {

        menuConhecimento.addEventListener("click", (e) => {
            e.preventDefault();

            dropdownMenu.classList.toggle("show");

            if (dropdownMenu.classList.contains("show")) {
                seta.style.display = "none";
            } else {
                seta.style.display = "inline";
            }
        });

        document.addEventListener("click", (e) => {

            if (
                !menuConhecimento.contains(e.target) &&
                !dropdownMenu.contains(e.target)
            ) {
                dropdownMenu.classList.remove("show");
                seta.style.display = "inline";
            }

        });
    }
});