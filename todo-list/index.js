//Criação da lista
// let tasks = [
//     {id: 1, description: 'Comprar pão', checked: false},
//     {id: 2, description: 'Trocar filtro', checked: false},
//     {id: 3, description: 'Fazer almoço', checked: false},
// ] Listas foi comentada no aula de LocalStorage, pois agora não precisamos mais de "lista chumbada"


//DESAFIO: Criação da barra que mostra o progresso das tarefas
const renderTasksProgress = (tasks) =>{
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');

    if (tasksProgressDOM) tasksProgress = tasksProgressDOM;
    else{
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newTasksProgressDOM); //o [0] faz com que o p código pegue o primeiro elemento com aquele nome.
        tasksProgress = newTasksProgressDOM;
    }

    const doneTasks = tasks.filter(({checked}) => checked).length //pega a quantidade tarefas concluídas
    const totalTasks = tasks.length; //Pega quantas tarefas existem
    tasksProgress.textContent = `${doneTasks}/${totalTasks} concluídas` //impimi na tela o resultado
}


//Funções para que a çista fique salva no loaclStorage do navegador
const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks)); //converte em string no navegador.
}

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks')); //transforma string em parse/código a ser lido, se não ele não entraia no array do código JS.
    return localTasks ? localTasks : []; //se a tarefa exitir retorna elas, s enão retornará um array vazio.
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage(); //usando as tasks salvas no local storage
    const updatedTasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks); //atualiza a lista tasks usando a função do local storage.
    renderTasksProgress(updatedTasks); //Depois de setar é que a tarefa será renderizada 

    document
        .getElementById("todoList")
        .removeChild(document.getElementById(taskId));
}

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage(); //primeiro lê as tarefas salvas no local storage
    const tasksToRemove = tasks
        .filter(({checked}) => checked)
        .map(({id}) => id) //pega o id das tarefas checadas
    
        const updatedTasks = tasks.filter(({checked}) => !checked);
        setTasksInLocalStorage(updatedTasks); //retorna tarfeas que não estão checadas
        renderTasksProgress(updatedTasks); //Depois de setar é que a tarefa será renderizada 

    tasksToRemove.forEach((taskToRemove) => {
        document.getElementById('todoList').removeChild(document.getElementById(taskToRemove))
    })
}

//Função de checkbox marcar flase ou true e mostrar no console
const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-');

    const tasks = getTasksFromLocalStorage();

    const updatedTasks = tasks.map((task) => {
        if (parseInt(task.id) === parseInt(id)) {
            return {...task, checked:event.target.checked}
        }
        return task
    })

    setTasksInLocalStorage(updatedTasks);
    renderTasksProgress(updatedTasks); //Depois de setar é que a tarefa será renderizada 
}

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todoList');
    const toDo = document.createElement('li');

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'X';
    removeTaskButton.ariaLabel = 'Remover tarefa';
    removeTaskButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTaskButton);
    list.appendChild(toDo);

    return toDo;

}

//Carrega a checagem de tarefa estar realizada ou não
const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input'); //Quadrado de checagem - tag input
    const label = document.createElement('label'); //criação da label - texto da tarefa
    const wrapper = document.createElement('div'); //criação da div que englobará tudo
    const checkboxId = `${id}-checkbox`;

    checkbox.type = "checkbox";
    checkbox.id = checkboxId; //o ${} permite que seja escrito um elemento do programa dentro de string, mas tem que ser escrito entre crases.
    checkbox.checked = checked || false; //o primeiro .checked é uma propriedade do JS, ele checará todas que possuirem o checked como true na lista. Este segundo checked poderia ser qualquer coisa, como checkbox.checked = x;
    checkbox.addEventListener('change', onCheckboxClick)

    label.textContent = description; //define qual o conteúdo da label criado na linha 11 do código
    label.htmlFor = checkboxId;


    wrapper.className = 'checkboxLabelContainer'; //wrapper é a div criaa na linha 12, e agora foi atrtibuída uma classe à ela
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper;
}

//funçãqo de pegar novo id
const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    //interrogação assinala que o valor pode ser "undefined", prevenindo erros do código

    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    //constante igual à um evento, que possui um target (nosso form), que possui elementos, o nome do elemento é description e lee pode possuir um valor. 

    const id = getNewTaskId();

    return {description, id};
}

//Aula de programção Assíncrona
const getCreatedTaskInfo = (event) => new Promise((resolve) =>{
    setTimeout(() => {
        resolve(getNewTaskData(event))
    }, 1000);
})

//Função que previne que a página recarregue com o description igual ao que foi escrito no input
const createTask = async (event) => { //virou uma função assíncrona
    event.preventDefault();
    document.getElementById('save-button').setAttribute('disabled', true) //estou falando que durante os tr~es segundos de ativação, o botão está desativado. 

    const newTaskData = await getCreatedTaskInfo(event);
    //const {description, id} = newTaskData;
    const checkbox = getCheckboxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks, 
        {id: newTaskData.id, description: newTaskData.description, checked: false}
    ]
    setTasksInLocalStorage(updatedTasks); //salva o UpdateTasks
    renderTasksProgress(updatedTasks); //Depois de setar é que a tarefa será renderizada 


    document.getElementById('description').value = '' //limpa a caixa de texto depois add tarefa.
    //html.pega peli id. id da tag input. seta o valor para texto vazio
    document.getElementById('save-button').removeAttribute('disabled') //botão volta ao normal
}

//Carrega lista na página no lugar do ul
window.onload = function() {
    const form = document.getElementById('todo-form');
    form.addEventListener('submit', createTask)

    const tasks = getTasksFromLocalStorage(); //agora toda vez que a página carregar, vai pegar o array salvo no Local Storage.

    tasks.forEach((tasks) => {
        const checkbox = getCheckboxInput(tasks);
        createTaskListItem(tasks, checkbox)
    })
    renderTasksProgress(tasks)
}