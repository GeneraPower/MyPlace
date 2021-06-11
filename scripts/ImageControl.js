let img_counter = 0; // счётчик для уникальности полей id

function AddImageField( imageNeededParams = {}, imgSource = "") {
    let canAdd = true;

    // Если не передали параметры, ставим их по умолчанию
    if(imageNeededParams === {})
    {
        imageNeededParams =
            {
                inputHolderId : 'input_placer',         // Место для размещения инпутов
                carouselBodyId : 'carousel-body'        // Место для размещения carousel-item
            };
    }

    //проверяем заполненны ли предыдушие поля для картинок
    curr_fields = document.getElementsByName("imageField");
    for (i = 0; i < curr_fields.length; i++) {

        //if (curr_fields[i].value === "") {
        if (curr_fields[i].readOnly === false) {
            canAdd = false;
            alert("Empty imgage field. Field #" + (i + 1));
            break;
        }
    }

    // Добавляем новое текстовое поле для ссылки на картинку
    if (canAdd) {
        let temp_counter_val =img_counter;

        t_div = document.createElement('div');
        t_div.className = "d-flex justify-content-between m-0 p-0";
        t_div.id = "helperImageDiv" + temp_counter_val;

        temp_inp = document.createElement('input');
        temp_inp.type = "text";
        temp_inp.name = "imageField";
        temp_inp.placeholder = placeholder = "Лінк на зображення";
        temp_inp.className = "col-8 mb-4";
        temp_inp.id = "imageField" + temp_counter_val;


        temp_inp.oninput = function () {
            addImages(temp_inp.value, temp_counter_val, temp_inp.id);
        };

        delete_butt = document.createElement('button');
        delete_butt.className="col-3  mb-4 btn btn-danger";
        delete_butt.style.backgroundColor = "#e69889";
        delete_butt.innerHTML = "Видалити";
        delete_butt.id = "deleteImageButton" + temp_counter_val;
        delete_butt.onclick = function()
        {
            //alert(parseInt(this.id.substring(17)));
            DeleteImageInfo(temp_counter_val, "helperImageDiv" + parseInt(this.id.substring(17))); // 17-- кол-во символов в "helperImageDiv"
        };


        news_body = document.getElementById(imageNeededParams.inputHolderId);
        t_div.appendChild(temp_inp);
        t_div.appendChild(delete_butt);
        news_body.appendChild(t_div);

        //Используеться при обновлении уже созданных новостей
        // imgSource --> ссылка на картинку
        if(imgSource !== "")
        {
            //Вставляем ссылку и блокируем инпут
            temp_inp.value = imgSource;
            temp_inp.readOnly = true;
            temp_inp.style.backgroundColor = "lightGrey";

            addImages(temp_inp.value, temp_counter_val, temp_inp.id);
        }

    }
    img_counter+= 1;
}

function DeleteImageInfo(index, helperDiv_id)
{

    img_div = document.getElementById("imgDiv" + index);
    if(img_div != null) {
        if (img_div.className !== "carousel-item active") {
            img_div.remove();
        }else {
            divs = document.getElementById(imageNeededParams.carouselBodyId).children;
            for (i = 0; i < divs.length; i++) {

                if (divs[i].className !== "carousel-item active") {
                    divs[i].className = "carousel-item active";
                    break;
                }
            }
            img_div.remove();
        }
    }

    t_div = document.getElementById(helperDiv_id);
    t_div.remove();
}

function addImages(src, index, input_id)
{
    //Блокируем соответствубщий инпут с ссылкой на картинку
    input = document.getElementById(input_id);
    input.readOnly = true;
    input.style.backgroundColor = "lightGrey";


    car_body = document.getElementById(imageNeededParams.carouselBodyId);

    //Если емелента еще не существует
    if(!document.getElementById("imgDiv" + index)) {
        img_div = document.createElement('div');
        img_div.name = "imgDiv";
        img_div.id = "imgDiv" + index;

        img = document.createElement('img');
        img.className = "d-block w-100";
        img.id = "imgImg" + index;
        img.height = 300;
        img.onerror = function () {
            img.src = "https://www.aubreydaniels.com/sites/default/files/default_images/x2017-05-15_5.png.pagespeed.ic.tLD9q0ZZph.png";
        };

        // запрашиваем картинку
        img.src = src;

        img_div.appendChild(img);
        car_body.appendChild(img_div);
    }
    else {
        //не вызываеться так как ставим свойство readonly = true
        /*
        // Обновляем существующию картинку
        img_div = document.getElementById("imgDiv" + index);
        img = document.getElementById("imgImg" + index);

        // запрашиваем картинку
        img.src = src;
        console.log("updated");
        $('.carousel').carousel();

         */
    }

    //Следим что бы был ровно 1 carousel-item active
    var temp = document.getElementsByClassName('carousel-item active');
    if(temp.length === 0) {
        img_div.className = "carousel-item active";
    }
    else{
        if(temp[0].id !== img_div.id) {
            img_div.className = "carousel-item";
        }
    }

    SetActive(img_div.id);
}

function SetActive(imgDiv_id){

    var img_div = document.getElementById(imgDiv_id);
    img_div.className = "carousel-item active";

    divs = document.getElementById(imageNeededParams.carouselBodyId).children;
    for (i = 0; i < divs.length; i++) {

        if (divs[i].id !== imgDiv_id) {
            divs[i].className = "carousel-item";
        }
    }
}