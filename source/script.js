const container = document.getElementById('container');
const upload_btn = document.getElementById('upload-btn');
let DATA = {};
let init = false;

const OnUpload = () => {
    let input = document.createElement('input');
    input.setAttribute('type', 'file');

    input.onchange = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (readEvent) {
            // reading data
            let content = readEvent.target.result;
            DATA = JSON.parse(content);
            init = true;

            Initialize();
        };
    };

    input.click();
};

const Initialize = (readEvent) => {
    // creating question
    for (let i = 0; i < DATA.length; i++)
        CreateQuestion(DATA[i], `question-${i}`);

    // managing button
    CreateButtons();
    if (upload_btn)
        upload_btn.style.visibility = 'hidden';
};

const CreateQuestion = (data, uid) => {
    const question = document.createElement('div');
    question.classList.add('mcq-item');

    const statement = document.createElement('div');
    statement.classList.add('statement');
    statement.innerText = data.question;
    question.append(statement);

    const options = document.createElement('div');
    options.classList.add('options');
    for (let i = 0; i < data.options.length; i++)
    {
        const option = document.createElement('div');
        option.classList.add('option-item');

        const radio = document.createElement('input')
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'option-' + uid);

        const label = document.createElement('label');
        label.innerText = data.options[i];
        
        option.append(radio);
        option.append(label);
        options.append(option);
    }
    question.append(options);
    container.append(question);
};

const CreateButtons = () => {
    if (!init) return;

    const buttons = document.createElement('div');
    buttons.id = "buttons";

    submit_btn = document.createElement('div');
    submit_btn.id = 'submit-btn';
    submit_btn.innerText = "SUBMIT";
    reset_btn = document.createElement('div');
    reset_btn.id = 'reset-btn';
    reset_btn.innerText = "RESET";

    buttons.append(submit_btn);
    buttons.append(reset_btn);

    submit_btn.onclick = OnSubmit;
    reset_btn.onclick = OnReset;

    container.append(buttons);
};

const OnReset = () => {
    init = false;
    
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach((value) => value.checked = false)
    
    init = true;
};

const OnSubmit = () => {
    if (!init) return;
    let count = container.children.length - 1;
    let data = new Array(count);

    for (let index = 0; index < count; index++)
    {
        const uid = 'question-' + index;        
        const radios = document.querySelectorAll(`input[name="option-${uid}"]`);
        
        const statement = DATA[index].question;
        let answer = ""
        let option_index = -1;

        radios.forEach((radio, index) => {
            if (radio.checked)
                option_index = index;
        });
        if (option_index != -1)
            answer = DATA[index].options[option_index];

        data[index] = {
            "statement": statement,
            "answer": answer,
            "option-index": option_index
        }
    }

    const json_data = JSON.stringify(data, null, 4);
    Download('Answers.json', json_data);
};  

const Download = (filename, data) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
    document.body.removeChild(element);
};



if (upload_btn == null || upload_btn.visibility == 'hidden')
    Initialize();