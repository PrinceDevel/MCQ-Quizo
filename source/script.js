const container = document.getElementById('container');
const upload_btn = document.getElementById('upload-btn');
let DATA = {};
let init = false;

// First Method that will be called as soon as file gets uploaded
const OnUpload = () => {
    // creating a input element in html
    let input = document.createElement('input');
    input.setAttribute('type', 'file');

    // if input changes
    input.onchange = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        // as soon as JSON file gets loaded
        reader.onload = function (readEvent) {
            // reading data
            let content = readEvent.target.result;
            DATA = JSON.parse(content);

            Initialize();   // Initializing
        };
    };

    input.click();
};

// After loading questions in DATA, this method will initialize the page
const Initialize = (readEvent) => {
    init = true;

    // creating question
    for (let i = 0; i < DATA.length; i++)
        CreateQuestion(DATA[i], `question-${i}`);

    // managing button
    CreateButtons();
    if (upload_btn) // hiding upload if loaded questions
        upload_btn.style.visibility = 'hidden';
};

// This is a method to create each question
const CreateQuestion = (data, uid) => {
    // creating root question
    const question = document.createElement('div');
    question.classList.add('mcq-item');

    // creating statement of question
    const statement = document.createElement('div');
    statement.classList.add('statement');
    statement.innerText = data.question;
    question.append(statement);

    // creating options
    const options = document.createElement('div');
    options.classList.add('options');
    // putting each option in options
    for (let i = 0; i < data.options.length; i++)
    {
        // creating option
        const option = document.createElement('div');
        option.classList.add('option-item');
        // giving it a radio field to choose
        const radio = document.createElement('input')
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'option-' + uid);
        // assigning it a label to show
        const label = document.createElement('label');
        label.innerText = data.options[i];
        // putting option in options
        option.append(radio);
        option.append(label);
        options.append(option);
    }
    // addding option to root question
    question.append(options);
    // adding to root to root[container] of HTML
    container.append(question);
};

// This is a method to create submit-btn and reset-btn
const CreateButtons = () => {
    if (!init) return;  // Buttons won't work if questions are not loaded

    // creating buttons at end of questions list
    const buttons = document.createElement('div');
    buttons.id = "buttons";

    // creating submit-btn
    submit_btn = document.createElement('div');
    submit_btn.id = 'submit-btn';
    submit_btn.innerText = "SUBMIT";
    // creating reset-btn
    reset_btn = document.createElement('div');
    reset_btn.id = 'reset-btn';
    reset_btn.innerText = "RESET";

    // adding each buttons
    buttons.append(submit_btn);
    buttons.append(reset_btn);

    // setting function of each button
    submit_btn.onclick = OnSubmit;
    reset_btn.onclick = OnReset;

    // adding button to root[container] of HTML
    container.append(buttons);
};

// This method will be called on clicking reset-btn
const OnReset = () => {
    init = false;
    
    // unchecking all radio fields
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach((value) => value.checked = false)
    
    init = true;
};

// This method will be called on clicking submit-btn
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

// This is method to download a file when submit-btn is clicked
const Download = (filename, data) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
    document.body.removeChild(element);
};

// IF Changes are done in HTML directly, and upload-btn is hidden or removed
if (upload_btn == null || upload_btn.visibility == 'hidden')
    Initialize();