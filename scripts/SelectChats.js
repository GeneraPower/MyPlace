// Требует:
//          boolean isHouseKeeper:
//                            true --> домоуправленец
//                            false --> админ
//          объект modalWindowParams:
//                            modalBodyDivId --> ID тела модального окна
//                            modalHeaderTitleId --> ID тела елемента с текстом заголовка модального окна
//                            modalEditorDivId --> ID тела div с содержимым модального окна
//          объект localStorageParams:
//                              HouseId --> Имя localStorage параметра для ID выбранного дома
//                              HouseName --> Имя localStorage параметра для Name выбранного дома
//                              PorchId --> Имя localStorage параметра для ID выбранного подъезда
//                              PorchName --> Имя localStorage параметра для Name выбранного подъезда
//                              (одно из двух) HouseKeeperToken --> токен домовладельца
//                              (одно из двух) AdminToken --> токен домовладельца
//          функция ShowModalFunction --> функция, что открывает модальное окно

//Обьект для что содержит все дома домоуправленца
let housesData = {};

//Обьект для что содержит подъезды одного выбранного дома
let porchesData = {};

function SelectHousesAndPorches(isHouseKeeper, modalWindowParams, localStorageParams, ShowModalFunction)
{
    // Проверяем наличие необходимых полей modalWindowParams
    if(!modalWindowParams.modalBodyDivId){
        throw new Error("Missing \"modalBodyDivId\" field in function modalWindowParams object")

    }else if(!modalWindowParams.modalHeaderTitleId){
        throw new Error("Missing \"modalHeaderTitleId\" field in function modalWindowParams object")

    }else if(!modalWindowParams.modalEditorDivId){
        throw new Error("Missing \"modalEditorDivId\" field in function modalWindowParams object")
    }

    // Проверяем наличие необходимых полей localStorageParams
    if(!localStorageParams.ChatID){
        throw new Error("Missing \"ChatID\" field in function localStorageParams object")
    }
    else if(isHouseKeeper === true && !localStorageParams.HouseKeeperToken){
        throw new Error("Missing \"HouseKeeperToken\" field in function localStorageParams object")
    }
    else if(isHouseKeeper === false && !localStorageParams.AdminToken){
        throw new Error("Missing \"AdminToken\" field in function localStorageParams object")
    }

    // Определяем какие функции вызывать
    switch (isHouseKeeper) {

        case true:
            HouseKeeperGetHouses(isHouseKeeper, modalWindowParams, localStorageParams, ShowModalFunction);
            break;
        case false:
            AdminGetHouses(isHouseKeeper, modalWindowParams, localStorageParams, ShowModalFunction);
            break;
    }
}

// Берем все дома админа
function AdminGetHouses(isHouseKeeper, modalWindowParams, localStorageParams, ShowModalFunction)
{}

// Берем все дома домоуправленца
function HouseKeeperGetHouses(isHouseKeeper, modalWindowParams, localStorageParams, ShowModalFunction)
{
    const head =
        {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + localStorage.getItem(localStorageParams.HouseKeeperToken)
        };

    fetch('https://prp-project-server.herokuapp.com/api/chat/', {
        method: 'GET',
        headers: head,
    })
        .then(response => response.json())
        .then(HousesData => {
            console.log('Success:', HousesData);
            housesData= HousesData;
            SelectHouses(isHouseKeeper,modalWindowParams, localStorageParams, ShowModalFunction);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//Добавляем выбор домов в диалоговом окне
function SelectHouses(isHouseKeeper,modalWindowParams, localStorageParams, ShowModalFunction)
{
    //Скрываем елементы для добавления новости
    document.getElementById(modalWindowParams.modalEditorDivId).hidden = true;

    modal = document.getElementById(modalWindowParams.modalBodyDivId);

    // добавляем область для домов
    var houseContainer = document.createElement("div");
    houseContainer.className = "container-fluid list-group p-0 m-0";
    houseContainer.id = "houseContainer0";

    modal.appendChild(houseContainer);

    //добавляем надпись
    document.getElementById(modalWindowParams.modalHeaderTitleId).innerHTML = "Оберіть необхідний чат:";

    //добавляем дома
    // k == idДома
    console.log(housesData.chats.apartment_chat_chat['0']['chat_id']);
    for(var k in housesData.chats.apartment_chat_chat)
    {
        var houseElement = document.createElement("div");

        houseElement.className = "list-group-item list-group-item-action border-2 pt-0";
        houseElement.style.minHeight = "100px";
        houseElement.style.height = "100px";
        houseElement.style.maxWidth = "795px";
        houseElement.style.backgroundColor = "rgba(255,164,51,0.73)";
        houseElement.style.borderColor = "rgba(0,0,0,0.73)";
        houseElement.onmouseover = function(){
            this.style.backgroundColor = "rgba(201,134,38,0.73)";
        };
        houseElement.onmouseleave = function(){
            this.style.backgroundColor = "rgba(255,164,51,0.73)";
        };

        houseElement.id = "houseElement" + housesData.chats.apartment_chat_chat[k]['chat_id'];
        houseElement.name =housesData.chats.apartment_chat_chat[k]['chat_id'];
        houseElement.onclick = function()
        {
            localStorage.setItem(localStorageParams.ChatID, this.name);
            DeleteElement(houseElement.parentElement.id);
            ShowModalFunction(); 
        };

        var houseName = document.createElement("h4");
        houseName.style.textAlign = "left";
        houseName.style.paddingTop = (parseInt(houseElement.style.height) / 3 ) + "px";
        houseName.style.alignSelf = "center";
        houseName.innerHTML = housesData.chats.apartment_chat_chat[k]['chat_id'];

        houseElement.appendChild(houseName);
        houseContainer.appendChild(houseElement);
    }
    for(var k in housesData.chats.porch_chat)
    {
        var houseElement = document.createElement("div");

        houseElement.className = "list-group-item list-group-item-action border-2 pt-0";
        houseElement.style.minHeight = "100px";
        houseElement.style.height = "100px";
        houseElement.style.maxWidth = "795px";
        houseElement.style.backgroundColor = "rgba(255,164,51,0.73)";
        houseElement.style.borderColor = "rgba(0,0,0,0.73)";
        houseElement.onmouseover = function(){
            this.style.backgroundColor = "rgba(201,134,38,0.73)";
        };
        houseElement.onmouseleave = function(){
            this.style.backgroundColor = "rgba(255,164,51,0.73)";
        };

        houseElement.id = "houseElement" + housesData.chats.porch_chat[k]['chat_id'];
        houseElement.name = housesData.chats.porch_chat[k]['chat_id'];
        houseElement.onclick = function()
        {            console.log(this.name + "baba")
            localStorage.setItem(localStorageParams.ChatID, this.name);
            DeleteElement(houseElement.parentElement.id);
            ShowModalFunction(); 
        };

        var houseName = document.createElement("h4");
        houseName.style.textAlign = "left";
        houseName.style.paddingTop = (parseInt(houseElement.style.height) / 3 ) + "px";
        houseName.style.alignSelf = "center";
        houseName.innerHTML =housesData.chats.porch_chat[k]['chat_id'];

        houseElement.appendChild(houseName);
        houseContainer.appendChild(houseElement);
    }
}
