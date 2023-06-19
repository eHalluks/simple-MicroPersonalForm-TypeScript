"use strict";
let editingPersonId = null;
const data = JSON.parse(localStorage.getItem("data") || "[]");
const formTest = document.getElementById("formToRead");
const nameInput = document.getElementById("nameID");
const surnameInput = document.getElementById("surnameID");
const ageInput = document.getElementById("ageID");
const countryInput = document.getElementById("countryID");
const listOfPersons = document.getElementById("fromLocalStorage");
const submitButton = document.getElementById("submitBtn");
const currDate = document.getElementById("currDate");
currDate.textContent = new Date().toLocaleDateString('pl-PL');
/*
    ##########################
    Walidowanie pul formularza
    ##########################
 */
const _validation = () => {
    const regexString = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+$/;
    const regexNumber = /^[0-9]+$/;
    if (nameInput.value.length < 3 || nameInput.value.length > 30 ||
        surnameInput.value.length < 3 || surnameInput.value.length > 50 ||
        ageInput.value.length < 1 || ageInput.value.length > 3 ||
        countryInput.value.length < 3 || countryInput.value.length > 50) {
        return false;
    }
    if (!regexString.test(nameInput.value) ||
        !regexString.test(surnameInput.value) ||
        !regexNumber.test(ageInput.value) ||
        !regexString.test(countryInput.value)) {
        return false;
    }
    return true;
};
/*
    ##########################
    Renderowanie listy persons
    ##########################
 */
const renderPersons = (data) => {
    listOfPersons.innerHTML = '';
    data.map((person) => {
        const personContainer = document.createElement("div");
        personContainer.classList.add("person-container"); // Dodanie klasy CSS do stylizacji
        const nameContainer = document.createElement("div");
        nameContainer.textContent = `Imię: ${person.name}`;
        nameContainer.classList.add("name"); // Dodanie klasy CSS do stylizacji
        personContainer.appendChild(nameContainer);
        const surnameContainer = document.createElement("div");
        surnameContainer.textContent = `Nazwisko: ${person.surname}`;
        surnameContainer.classList.add("surname"); // Dodanie klasy CSS do stylizacji
        personContainer.appendChild(surnameContainer);
        const ageContainer = document.createElement("div");
        ageContainer.textContent = `Wiek: ${person.age}`;
        ageContainer.classList.add("age"); // Dodanie klasy CSS do stylizacji
        personContainer.appendChild(ageContainer);
        const countryContainer = document.createElement("div");
        countryContainer.textContent = `Kraj: ${person.country}`;
        countryContainer.classList.add("country"); // Dodanie klasy CSS do stylizacji
        personContainer.appendChild(countryContainer);
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container"); // Dodanie klasy CSS do stylizacji
        const editButton = document.createElement("button");
        editButton.textContent = "Edytuj";
        editButton.dataset.personId = String(person.id);
        editButton.addEventListener("click", handleEdit);
        editButton.classList.add("edit-button"); // Dodanie klasy CSS do stylizacji
        buttonContainer.appendChild(editButton);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Usuń";
        deleteButton.dataset.personId = String(person.id);
        deleteButton.addEventListener("click", handleDelete);
        deleteButton.classList.add("delete-button"); // Dodanie klasy CSS do stylizacji
        buttonContainer.appendChild(deleteButton);
        personContainer.appendChild(buttonContainer);
        listOfPersons.appendChild(personContainer);
    });
};
/*
    #############
    Edycja danych
    #############
 */
function handleEdit(event) {
    submitButton.textContent = "Aktualizuj";
    const button = event.target;
    const personId = button.dataset.personId;
    if (personId) {
        data.forEach((item) => {
            if (item.id === Number(personId)) {
                editingPersonId = item;
                nameInput.value = item.name;
                surnameInput.value = item.surname;
                ageInput.value = item.age;
                countryInput.value = item.country;
            }
        });
    }
}
/*
    ###############
    Usuwanie person
    ###############
 */
function handleDelete(event) {
    const button = event.target;
    const personId = button.dataset.personId;
    if (personId) {
        let personIndex = -1;
        data.forEach((person, index) => {
            if (person.id === Number(personId)) {
                personIndex = index;
            }
        });
        if (personIndex !== -1) {
            data.splice(personIndex, 1);
            localStorage.setItem("data", JSON.stringify(data));
            renderPersons(data);
        }
    }
}
/*
    #######################
    Wyświetlanie listy osób
    #######################
 */
document.addEventListener("DOMContentLoaded", () => {
    renderPersons(data);
});
/*
    ##################
    Obsługa formularza
    ##################
 */
formTest.addEventListener("submit", (event) => {
    event.preventDefault();
    if (editingPersonId) {
        if (!_validation()) {
            alert("Wprowadzono nie poprawne dane");
            editingPersonId = null;
            throw new Error("Validation failed");
        }
        const newName = nameInput.value;
        const newSurname = surnameInput.value;
        const newAge = ageInput.value;
        const newCountry = countryInput.value;
        const personsArrUpdating = JSON.parse(localStorage.getItem("data") || "[]");
        personsArrUpdating.forEach((item) => {
            if (item.id === Number(editingPersonId === null || editingPersonId === void 0 ? void 0 : editingPersonId.id)) {
                item.name = newName;
                item.surname = newSurname;
                item.age = newAge;
                item.country = newCountry;
            }
        });
        localStorage.setItem("data", JSON.stringify(personsArrUpdating));
        renderPersons(personsArrUpdating);
        submitButton.textContent = "Dodaj";
        nameInput.value = "";
        surnameInput.value = "";
        ageInput.value = "";
        countryInput.value = "";
        editingPersonId = null;
    }
    else {
        if (!_validation()) {
            alert("Wprowadzono nie poprawne dane");
            throw new Error("Validation failed");
        }
        const newPerson = {
            id: new Date().getTime(),
            name: nameInput.value,
            surname: surnameInput.value,
            age: ageInput.value,
            country: countryInput.value,
        };
        try {
            data.push(newPerson);
            localStorage.setItem("data", JSON.stringify(data));
            renderPersons(data);
            nameInput.value = "";
            surnameInput.value = "";
            ageInput.value = "";
            countryInput.value = "";
        }
        catch (error) {
            console.log("Error:", error);
        }
    }
});
