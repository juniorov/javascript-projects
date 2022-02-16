(function () {

    //UI
    const lists = document.querySelector('.tasks');
    const btn_add = document.querySelector('#btn-add');
    const task_input = document.querySelector('#task_text');
    const filter_input = document.querySelector('#filter_task');

    //Data
    var tasks = (localStorage.getItem('tasks') !== null && localStorage.getItem('tasks') != "") ? JSON.parse(localStorage.getItem('tasks')) : [];


    //Functions
    function getTasks() {
        if (tasks.length > 0) {
            populateTasks(tasks);
        }

        return tasks;
    }

    function populateTasks(tasks) {
        let items = '',
            status = '',
            check = '';

        tasks.forEach((element, index) => {
            status = element.status === 'done' ? 'unstroke' : '';
            check = element.status === 'done' ? 'checked' : '';

            items += `<li class="collection-item" data-index="${index}">
                <label>
                    <input type="checkbox" ${check}/>
                    <span class="${status}">${element.task}</span>
                </label>
            </li>`;
        });

        lists.innerHTML = items;
    }

    function addTask() {
        let task = task_input.value;

        if (task.length > 0) {
            tasks.push({task, status: 'pending'});
            populateTasks(tasks);
            task_input.value = "";
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } else
            alert('Please write a task');
    }

    function reorderDoneTask(e) {
        let target = e.target,
            parent = null,
            task = null;

        if (target.localName !== "input") return;

        if (target.localName === "input") {
            parent = target.parentNode.parentNode;
            task = tasks[parent.dataset.index];
            tasks.splice(parent.dataset.index, 1);

            if (target.checked) {
                task.status = 'done';
                tasks.push(task);
            } else {
                task.status = 'pending';
                tasks.unshift(task);
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
            populateTasks(tasks);
        }

        e.stopPropagation();
    }

    function filterTask(e) {
        let filters = tasks.filter(item => item.task.includes(this.value));
        populateTasks(filters);
    }

    //Events
    window.addEventListener('DOMContentLoaded', () => {
        getTasks();
    });

    btn_add.addEventListener('click', addTask);
    lists.addEventListener('click', reorderDoneTask);
    filter_input.addEventListener('keyup', filterTask);
})()