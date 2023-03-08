let informationObject = {
    id: '',
    schedule: '',
    personality: '',
    hobby1:'',
    major:''
};

async function submitQuestionnaire() {
    fetch('/auth/questionnaire', {
        method: 'POST',
        body: JSON.stringify(informationObject),
        headers: {
          'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((res) => {
        if (res.error === null) {
            document.getElementById('success-container').removeAttribute('hidden');    
        } else {
            document.getElementById('failure-container').removeAttribute('hidden');
        }
    })
    .catch((err) => {
        document.getElementById('failure-container').removeAttribute('hidden');
    });
}

async function schedule(event) {
    informationObject.schedule = event.target.innerText;
    document.getElementById('first-container').style.display="none";
    document.getElementById('second-container').removeAttribute('hidden');
}

async function personality(event) {
    informationObject.personality = event.target.innerText;
    document.getElementById('second-container').style.display="none";
    document.getElementById('third-container').removeAttribute('hidden');
}

async function hobbies(event) {
    informationObject.hobby1 = event.target.innerText;
    document.getElementById('third-container').style.display="none";
    document.getElementById('fourth-container').removeAttribute('hidden');
}

async function major(event) {
    informationObject.major = event.target.innerText;
    document.getElementById('fourth-container').style.display="none";
    
    // Submit the questionnaire to the database.
    await submitQuestionnaire();
}

const firstSelectorButtons = document.getElementById('selection').querySelectorAll('.btn');
for (let i=0; i < firstSelectorButtons.length; i++) {
    firstSelectorButtons[i].addEventListener('click', (event) => {
        schedule(event);
    });
}

const secondSelectorButtons = document.getElementById('second-selection').querySelectorAll('.btn');
for (let i=0; i < secondSelectorButtons.length; i++) {
    secondSelectorButtons[i].addEventListener('click', (event) => {
        personality(event);
    });
}

const thirdSelectorButtons = document.getElementById('third-selection').querySelectorAll('.btn');
for (let i=0; i < thirdSelectorButtons.length; i++) {
    thirdSelectorButtons[i].addEventListener('click', (event) => {
        hobbies(event);
    });
}

const fourthSelectorButtons = document.getElementById('fourth-selection').querySelectorAll('.btn');
for (let i=0; i < fourthSelectorButtons.length; i++) {
    fourthSelectorButtons[i].addEventListener('click', (event) => {
        major(event);
    });
}

window.onload = () => {
    // Get the id from the hidden input field and add it to the information
    // object.
    const id = document.getElementById('id-field').value;
    informationObject.id = id;
}