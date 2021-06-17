async function GetUnreadLettersCount(placerId)
    {
        const head =
            {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + localStorage.getItem('houseKeeperToken')
            };

        fetch('https://prp-project-server.herokuapp.com/api/letter/unread-letters', {
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
                localStorage.setItem("UnreadLettersCount", LettersData.unread_letters.letter_count);
                let placer = document.getElementById(placerId);
                if( placer.innerHTML != LettersData.unread_letters.letter_count || unread_letters.letter_count != localStorage.getItem("UnreadLettersCount")) {
                    console.log("done");
                    document.getElementById(placerId).innerHTML = LettersData.unread_letters.letter_count;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        return true;
    }