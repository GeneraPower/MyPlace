oneLetterData = {};
async function GetOneLetter(letter_id)
{
    console.log("ID  " + letter_id);
    const head =
        {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + localStorage.getItem('houseKeeperToken')
        };

    fetch('https://prp-project-server.herokuapp.com/api/letter/' + letter_id, {
        method: 'GET',
        headers: head
    })
        .then(response => response.json())
        .then(LetterData => {
            console.log('Success:', LetterData);
            oneLetterData  = LetterData;
            EditLetter();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    return true;
}

function ucFirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function EditLetter() {

    AuthSecondName = oneLetterData.letter.inhabitant_info.second_name;
    AutnFirstName = oneLetterData.letter.inhabitant_info.name;

    document.getElementById('author').innerHTML = "Мешканець " + ucFirst(AuthSecondName) + " " + ucFirst(AutnFirstName);
    document.getElementById('letter_porch').innerHTML ="Під'їзд: " + oneLetterData.letter.porch_name;
    document.getElementById('letter_house').innerHTML = "Дім: " + oneLetterData.letter.house_number;
    document.getElementById('letter_body').value = oneLetterData.letter.answer_text;

    // На письмо уже был дан ответ
    if(oneLetterData.letter.reply_type !== null){
        let replyBody = document.getElementById("letter_reply");
        replyBody.value = oneLetterData.letter.reply_text;
        replyBody.readOnly = true;
        document.getElementById('IsAnsweredDiv').hidden = false;
        document.getElementById('letter_save').hidden = true;

        if(oneLetterData.letter.reply_type === true) {
            let radio = document.getElementById('option-1');
            radio.checked = true;
            radio.disabled = true;
            GreenShadow();
            document.getElementById('option-2').disabled = true;
        }
        else{
            let radio = document.getElementById('option-2');
            radio.checked = true;
            radio.disabled = true;
            RedShadow();
            document.getElementById('option-1').disabled = true;
        }
    }

    // Функция для обновления письма при нажатии на кнопку Сохранить
    document.getElementById('letter_save').onclick = async function () {
        if(document.getElementById("letter_reply").value.length > 0){
            //Отправляем новые данные на сервер
            const temp_body =
                {
                    repty_text: document.getElementById('letter_reply').value,
                    reply_type: document.getElementById('option-1').checked
                };
            console.log(temp_body);
            await UpdateLetter(oneLetterData.letter.letter_id, temp_body);

            CloseDialogWindow();
        } else{
            document.getElementById('errorMessage').hidden = false;
        }
    };

    //отображаем текущюю информацию о новости
    ShowDialogWindow();
}

function UpdateLetter(letterId, letterData) {
    const head =
        {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + localStorage.getItem('houseKeeperToken')
        };
    fetch('https://prp-project-server.herokuapp.com/api/letter/' + letterId, {
        method: 'PUT',
        headers: head,
        body: JSON.stringify(letterData)
    })
        .then(response => response.json())
        .then(LetterData => {
            console.log('Success:', LetterData);
            // Обновляем локальный json
            // с учетом возможности изменения id в бд
            GetLetters();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}