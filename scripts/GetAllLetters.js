
letters = {};
async function GetLetters()
{

    const head =
        {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + localStorage.getItem('houseKeeperToken')
        };

    fetch('https://prp-project-server.herokuapp.com/api/letter/', {
        method: 'GET',
        headers: head
    })
        .then(response => response.json())
        .then(LettersData => {
            console.log('Success:', LettersData);
            //Если закончилось время длительности токена
            if(LettersData.error_message && LettersData.error_message.indexOf("token") !== -1)
            {
                alert("Час сессії було вичерпано. Якщо ві бажаєте продовжити роботу, виконайте повторний вхід");
                Exit();
            }

            letters = LettersData;
            FillLetters();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    return true;
}

function FillLetters(){

    //Удаляем элементы при повторном отображении
    DeleteChildren('content');

    let notAnswearedCount = 0;
    let isAnswered = false;

    let first = true;
    for(var key in letters.letters){

        LetterId = letters.letters[key].letter_id;

        var parBlock = document.createElement("div");
        parBlock.style.display = "flex";
        parBlock.id = "parBlock"+LetterId;

        if(!first) {
            parBlock.style.marginTop = "10px";
        }
        else
        {
            parBlock.style.marginTop = "2px";
            first = false;
        }

        //rgba(255,164,51,0.73)
        let color = "rgba(208,208,208,0.73)";
        if(letters.letters[key].reply_type === true) {
            color = "#b8e6a2";
            isAnswered = true;
        }else if(letters.letters[key].reply_type === false){
            color = "#e69889";
            isAnswered = true;
        }else{
            notAnswearedCount++;
        }

        parBlock.onclick = async function () {
            await GetOneLetter(this.id.substring(8));
        };

        var elem1 = document.createElement("div");
        var elem2 = document.createElement("div");
        var elem3 = document.createElement("div");
        var elem4 = document.createElement("div");
        elem1.style.marginLeft = "2px";
        //elem6.style.marginRight = "2px";

        elem1.id = parBlock.id + "elem1";
        elem1.name = parBlock.id + "elem2";
        elem2.id = parBlock.id + "elem3";
        elem3.id = parBlock.id + "elem4";
        elem4.id = parBlock.id + "elem5";



        elem1.style.outline = "2px solid #000";
        elem2.style.outline = "2px solid #000";
        elem3.style.outline = "2px solid #000";
        elem4.style.outline = "2px solid #000";


        elem1.style.backgroundColor = color;
        elem2.style.backgroundColor = color;
        elem3.style.backgroundColor = color;
        elem4.style.backgroundColor = color;

        elem1.style.width = "10%";
        elem2.style.width = "10%";
        elem3.style.width = "20%";
        elem4.style.width = "59%";
        elem1.style.wordWrap = "break-word";
        elem2.style.wordWrap = "break-word";
        elem3.style.wordWrap = "break-word";
        elem4.style.wordWrap = "break-word";
        var pel1 = document.createElement("p");
        var pel2 = document.createElement("p");
        var pel3 = document.createElement("p");
        var pel4 = document.createElement("p");
        pel3.id="title"+LetterId;
        pel3.name = LetterId;
        pel4.id="text"+LetterId;
        pel4.name = LetterId;
        pel1.style.textAlign = "center";
        pel2.style.textAlign = "center";
        pel3.style.textAlign = "center";
        pel4.style.textAlign = "center";
        pel1.style.fontFamily = "Century Gothic";
        pel1.style.fontSize = "20px";
        pel2.style.fontSize = "20px";
        pel3.style.fontSize = "20px";
        pel4.style.fontSize = "20px";
        pel2.style.fontFamily = "Century Gothic";
        pel3.style.fontFamily = "Century Gothic";
        pel4.style.fontFamily = "Century Gothic";


        AuthSecondName = letters.letters[key].inhabitant_info.second_name;
        AutnFirstName = letters.letters[key].inhabitant_info.name;
        pel1.innerHTML = AuthSecondName + "\n" + AutnFirstName;
        pel2.innerHTML = letters.letters[key].house_number;
        pel3.innerHTML = letters.letters[key].porch_name;
        pel4.innerHTML = (letters.letters[key]['answer_text'].length > 100) ? letters.letters[key]['answer_text'].substr(0,100) + "..." : letters.letters[key]['answer_text'];
        elem1.appendChild(pel1);
        elem2.appendChild(pel2);
        elem3.appendChild(pel3);
        elem4.appendChild(pel4);

        parBlock.appendChild(elem1);
        parBlock.appendChild(elem2);
        parBlock.appendChild(elem3);
        parBlock.appendChild(elem4);

        parBlock.onmouseover = function()
        {
            let childElems = this.children;
            for(let i = 0; i < childElems.length; i++)
            {
                document.getElementById(childElems[i].id).style.backgroundColor = "rgba(161,161,161,0.73)";
            }

        };

        parBlock.onmouseleave = function()
        {
            let childElems = this.children;
            for(i = 0; i < childElems.length; i++)
            {
                document.getElementById(childElems[i].id).style.backgroundColor = color;
            }
        };

        document.getElementById("Total count").innerHTML = "Усього: " + letters.letters.length;
        document.getElementById("Unreplied count").innerHTML = "Потребує відповіді: " + notAnswearedCount;

        document.getElementById("content").appendChild(parBlock);
    }
}
