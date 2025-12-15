const questions = [
    {
        text : "Which keyword declares a constant in JavaScript?",
        options : ["var", "let", "const", "static"],
        correctIndex : 2
    },
    {   
        text : "Which method is used to log output to the console?",
        options : ["print()", "log()", "console()", "console.log()"],
        correctIndex : 3
    },
    {
        text : "Which of these is NOT a JavaScript data type?",
        options : ["number", "string", "boolean", "character"],
        correctIndex : 3
    },
    {
        text : "What is the correct way to write an arrow function?",
        options : ["function => {}", "() => {}", "() -> {}", "=> () {}"],
        correctIndex : 1
    },
    {
        text : "Which operator is used for strict equality?",
        options : ["==", "===", "!=", "!=="],
        correctIndex : 1
    },
    {
        text : "Which method converts a JSON string into an object?",
        options : ["JSON.convert()", "JSON.parse()", "JSON.stringify()", "JSON.object()"],
        correctIndex : 1
    },
    {
        text : "What is the value of typeof null?",
        options : ["null", "undefined", "object", "number"],
        correctIndex : 2
    },
    {
        text : "Which keyword is used to declare a block-scoped variable?",
        options : ["var", "let", "define", "static"],
        correctIndex : 1
    },
    {
        text : "What will '5' + 3 evaluate to?",
        options : ["8", "53", "Error", "NaN"],
        correctIndex : 1
    },
    {
        text : "Which method is used to add an element to the end of an array?",
        options : ["push()", "pop()", "shift()", "unshift()"],
        correctIndex : 0
    }
];


let confettiRunning = true;  

function slowSideConfetti() {
  if (!confettiRunning) return;

  confetti({
    particleCount: 3,  
    angle: 60,
    spread: getResponsiveSpread(),
    origin: { x: 0 },
    colors: ["#3EFFA8", "#FFA53E"],
    startVelocity: 28,   
    gravity: 0.3,        
  });

  confetti({
    particleCount: 3,
    angle: 120,
    spread: getResponsiveSpread(),
    origin: { x: 1 },
    colors: ["#bb0000", "#ffffff"],
    startVelocity: 28,
    gravity: 0.3,
  });

  setTimeout(slowSideConfetti, 25);  
}

function getResponsiveSpread() {
  if (window.innerWidth <= 400) return 10;  
  if (window.innerWidth <= 600) return 35;  
  if (window.innerWidth <= 900) return 50;  
  return 60;                              
}


const QuestionNumberElement = document.getElementById("question-no")
const QuestionElement = document.getElementById("questions")
const OptionElement = document.getElementById("options")
const NextElement = document.getElementById("nxtbtn")
const ErrorElement = document.getElementById("err-display")
const QuizElement = document.getElementById("quiz-container")
const ScoreElement = document.getElementById("score-container")
const ValueElement = document.getElementById("score")
const WelcomeElement = document.getElementById("welcome-container")
const StartElement = document.getElementById("start")
const RoundTypeElement = document.getElementById("roundtype")
const TimerElement = document.getElementById('timer')
const GreetElement = document.getElementById('greet')

let count = 0
let score = 0
let selectedIndex = null
let roundType = null
let selectedButton = null
let timeInterval = null

RoundTypeElement.addEventListener("click" , (event) => {
    event.preventDefault()

    if(event.target && event.target.tagName == 'BUTTON'){

        if(selectedButton) { selectedButton.classList.remove('selected') }
        
        selectedButton = event.target
        selectedButton.classList.add('selected')

        if(selectedButton.id == 'rapid') roundType = 'rapid'
        if(selectedButton.id == 'normal') roundType = 'normal'
    }
})

StartElement.addEventListener("click" , (event) => {
    event.preventDefault()


    if(!roundType){
        alert('Please Select The Round Type')
        return ;
    }
    else{
        WelcomeElement.classList.add("hidden")
        QuizElement.classList.remove("hidden")
        loadQuestion()
    }
    
})


function loadQuestion() {

    if(timeInterval){
        clearInterval(timeInterval)
        timeInterval = null
    }
    
    timeLeft = roundType === 'rapid' ? 10 : 20

    selectedIndex = null
    NextElement.disabled = true

    QuestionNumberElement.innerHTML = count + 1
    QuestionElement.innerHTML = questions[count].text

    let option_arr = questions[count].options

    for(let i = 0; i < option_arr.length; i++){
        OptionElement.children[i].innerText = option_arr[i]
        OptionElement.children[i].classList.remove("bg-green-400","text-black")
        OptionElement.children[i].classList.add("bg-gray-700","text-white")
    }

    startTimer()
}


function startTimer() {
    TimerElement.innerText = timeLeft

    timeInterval = setInterval(() => {
        timeLeft--
        TimerElement.innerText = timeLeft

        if(timeLeft <= 0){
            clearInterval(timeInterval)
            timeInterval = null
            NextElement.disabled = false
            proceedToNext(true)
        }
    } , 1000)
}

OptionElement.addEventListener("click" , (event) => {
    const clicked = event.target

    if(!clicked.classList.contains("option")) return;

    for(let opt of OptionElement.children){
        opt.classList.remove("bg-green-400","text-black")
        opt.classList.add("bg-gray-700","text-white")
    }

    clicked.classList.remove("bg-gray-700","text-white")
    clicked.classList.add("bg-green-400","text-black")

    for(let i = 0; i < OptionElement.children.length ;i++){
        if(OptionElement.children[i] == clicked){
            selectedIndex = i
        }
    }

    NextElement.disabled = false
})


NextElement.addEventListener("click" , (event) => {
    event.preventDefault()

    proceedToNext(false)
})

function proceedToNext(isAuto = false) {
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
    }

    // Manual NEXT requires selected option
    if (!isAuto && selectedIndex === null) {
        ErrorElement.innerText = "Please choose an option !!";
        NextElement.disabled = true;
        return;
    }

    NextElement.disabled = true;
    ErrorElement.innerText = "";

    // Score update only if answered
    if (selectedIndex !== null &&
        selectedIndex === questions[count].correctIndex) {
        score++;
    }

    count++;
    selectedIndex = null;

    // QUIZ END
    if (count >= questions.length) {
        QuizElement.classList.add("hidden");
        ScoreElement.classList.remove("hidden");

        if (score <= 4) {
            GreetElement.innerText =
                "You're just getting started, and that's completely fine. Review the basics and try again — you'll improve quickly.";
        } else if (score <= 7) {
            GreetElement.innerText =
                "Good work! You've understood many concepts well. With a little more practice, you can easily reach a high score.";
        } else {
            GreetElement.innerText =
                "Excellent performance! You answered most questions correctly. Keep it up — you're doing great.";
        }

        ValueElement.innerText = `Your score is ${score} of ${questions.length}`;

        confettiRunning = true;
        slowSideConfetti();
        return;
    }

    // Load next question (this resets selectedIndex safely)
    loadQuestion();
}
