// closes modal
document.querySelector("#closeModal").addEventListener("click", () => {document.querySelector("#authorModal").close()})
        
let authorLinks = document.querySelectorAll(".authorNames");
for (let i of authorLinks) {
    i.addEventListener("click", displayAuthorInfo);
}

async function displayAuthorInfo() {
    let authorId = this.getAttribute("authorId");
    // alert("displaying author info..." + authorId);
    let url = "/api/author/"+authorId;
    let response = await fetch(url);
    let data = await response.json();
    document.querySelector("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
    document.querySelector("#authorPicture").src = data[0].portrait;
    document.querySelector("#authorBio").textContent = data[0].biography;
    document.querySelector("#authorDOB").textContent = data[0].dob;
    document.querySelector("#authorDOD").textContent = data[0].dod;
    document.querySelector("#authorSex").textContent = data[0].sex;
    document.querySelector("#authorCountry").textContent = data[0].country;
    document.querySelector("#authorProfession").textContent = data[0].profession;

    // enable modal
    document.querySelector("#authorModal").showModal();
}

