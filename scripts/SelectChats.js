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
    console.log(housesData);
    console.log(housesData.chats.apartment_chat_chat['0']['chat_id']);
    /*for(var k in housesData.houses)
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

        houseElement.id = "houseElement" + k;
        houseElement.name = k;
        houseElement.onclick = function()
        {
            localStorage.setItem(localStorageParams.HouseId, this.name);
            localStorage.setItem(localStorageParams.HouseName, this.children[0].innerHTML);
            DeleteElement(houseElement.parentElement.id);
            switch (isHouseKeeper) {
                case true:
                    HouseKeeperGetPorches(isHouseKeeper,this.name, modalWindowParams, localStorageParams, ShowModalFunction );
                    break;
                case false:
                    AdminGetPorches(isHouseKeeper,houseId, modalWindowParams, localStorageParams, ShowModalFunction);
                    break;
            }
        };

        var houseName = document.createElement("h4");
        houseName.style.textAlign = "left";
        houseName.style.paddingTop = (parseInt(houseElement.style.height) / 3 ) + "px";
        houseName.style.alignSelf = "center";
        houseName.innerHTML = housesData.houses[k].house_number;

        houseElement.appendChild(houseName);
        houseContainer.appendChild(houseElement);
    }*/
}

function AdminGetPorches(isHouseKeeper,houseId, modalWindowParams, localStorageParams, ShowModalFunction)
{

}

// Запрашиваем подъезды по указанному Id дома
function HouseKeeperGetPorches(isHouseKeeper,houseId, modalWindowParams, localStorageParams, ShowModalFunction)
{
    const head =
        {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + localStorage.getItem(localStorageParams.HouseKeeperToken)
        };

    fetch('https://prp-project-server.herokuapp.com/api/porch/' + houseId, {
        method: 'GET',
        headers: head,
    })
        .then(response => response.json())
        .then(Data => {
            console.log('Success:', Data);
            porchesData = Data;
            SelectPorches(modalWindowParams, localStorageParams, ShowModalFunction);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//Добавляем выбор подъездов в диалоговом окне
function SelectPorches(modalWindowParams, localStorageParams, ShowModalFunction )
{
    modal = document.getElementById(modalWindowParams.modalBodyDivId);

    // добавляем область для подъездов
    var porchContainer = document.createElement("div");
    porchContainer.className = "container-fluid  p-0 m-0";
    porchContainer.id = "porchContainer0";

    modal.appendChild(porchContainer);

    //добавляем надпись
    document.getElementById(modalWindowParams.modalHeaderTitleId).innerHTML = "Оберіть необхідний під`їзд";

    //добавляем кнопку для создания новости
    var porchCreateButton = document.createElement("button");
    porchCreateButton.id = "porchCreateButton";
    porchCreateButton.innerHTML = "Додати новину до " + localStorage.getItem(localStorageParams.HouseName);
    porchCreateButton.className = "btn btnAdd mb-4 ";
    porchCreateButton.style.fontSize = "20px";
    porchCreateButton.onclick = function()
    {
        localStorage.setItem(localStorageParams.PorchId, "null");
        localStorage.setItem(localStorageParams.PorchName, "null");
        DeleteElement(porchContainer.id);
        //ShowModalEditor();
        ShowModalFunction();        // Используем переданую функцию для далнейшей роботы программы
    };
    porchContainer.appendChild(porchCreateButton);

    var porchDivsContainer = document.createElement("div");
    porchDivsContainer.className = "container-fluid list-group p-0 m-0";
    porchDivsContainer.id = "porchDivsContainer0";

    //добавляем подъезды
    //k == News_id
    let firstElem = true;
    for(var k in porchesData.porches)
    {
        var porchElement = document.createElement("div");
        porchElement.className = "list-group-item list-group-item-action border-2 pt-0";
        porchElement.style.height = "100px";
        porchElement.style.maxWidth = "795px";
        porchElement.style.backgroundColor = "rgba(255,198,98,0.73)";
        porchElement.style.borderColor = "rgba(0,0,0,0.73)";
        porchElement.onmouseover = function(){
            this.style.backgroundColor = "rgba(205,154,81,0.73)";
        };
        porchElement.onmouseleave = function(){
            this.style.backgroundColor = "rgba(255,198,98,0.73)";
        };


        porchElement.id = "porchElement" + k;
        porchElement.name = k;
        porchElement.onclick = function()
        {
            localStorage.setItem(localStorageParams.PorchId, this.name);
            localStorage.setItem(localStorageParams.PorchName, this.children[0].innerHTML);
            DeleteElement(porchContainer.id);
            //ShowModalEditor();
            ShowModalFunction();    // Используем переданую функцию для далнейшей роботы программы
        };


        var porchName = document.createElement("h4");
        porchName.style.textAlign = "left";
        porchName.style.paddingTop = (parseInt(porchElement.style.height) / 3 ) + "px";
        porchName.style.alignSelf = "center";
        porchName.innerHTML = porchesData.porches[k].porch_name;

        porchElement.appendChild(porchName);
        porchDivsContainer.appendChild(porchElement);
        porchContainer.appendChild(porchDivsContainer);
    }
}
