class Task {
  constructor({
    id = Date.now() + Math.random(1000),
    description = '',
    resolved = false,
    creationDate = new Date(),
    resolutionDate = null,
  }) {
    this.id = id;
    this.description = description;
    this.resolved = resolved;
    this.creationDate = creationDate;
    this.resolutionDate = resolutionDate;
  }

  resolve = () => {
    this.resolved = true;
    this.resolutionDate = new Date();
  };

  reopen = () => {
    this.resolved = false;
    this.resolutionDate = null;
  };

  edit = newDescription => {
    this.description = newDescription;
  };

  static render = (task, tasksSection) => {
    const taskElement = document.createElement('li');
    taskElement.className = 'task';
    taskElement['data-id'] = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.resolved;
    taskElement.appendChild(checkbox);

    const description = document.createElement('span');
    description.className = 'description';
    description.innerHTML = task.description;
    taskElement.appendChild(description);

    const dates = document.createElement('div');
    dates.className = 'datesWrapper';
    if (task.creationDate) {
      const creationDate = document.createElement('span');
      creationDate.classList.add('date', 'creationDate');
      creationDate.innerHTML = task.creationDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      dates.appendChild(creationDate);
    }
    if (task.resolutionDate) {
      const resolutionDate = document.createElement('span');
      resolutionDate.classList.add('date', 'resolutionDate');
      resolutionDate.innerHTML = task.resolutionDate.toLocaleTimeString(
        'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      );
      dates.appendChild(resolutionDate);
    }
    taskElement.appendChild(dates);
    tasksSection.appendChild(taskElement);
  };
}

export default Task;
