import Task from './task';

class TaskList {
  constructor({
    tasks = [],
    selectedSortingType = SORTING_TYPE.DESCRIPTION_ASC,
    availableSortingTypes,
  }) {
    this.tasks = tasks;
    this.selectedSortingType = selectedSortingType;
    this.availableSortingTypes = availableSortingTypes;
  }

  getTask = taskId => {
    return this.tasks.find(task => task.id === taskId);
  };

  addTask = task => {
    this.tasks.push(task);
  };

  removeTask = taskId => {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  };

  wipeList = () => {
    this.tasks = [];
  };

  sortList = selectedSortingType => {
    this.selectedSortingType = selectedSortingType;
    this.tasks = this.tasks.sort(
      comparator(selectedSortingType.field, selectedSortingType.isAsc),
    );
  };

  filterList = searchTerm => {
    return this.tasks.filter(task => task.description.includes(searchTerm));
  };

  static renderSortings = (taskList, section) => {
    const sortSection = section.getElementsByClassName('sortSelect')[0];
    taskList.availableSortingTypes.forEach(sortingType => {
      const sortingOption = document.createElement('option');
      sortingOption.innerHTML = sortingType.label;
      if (sortingType.label === taskList.selectedSortingType.label) {
        sortingOption.selected = 'selected';
      }
      sortSection.appendChild(sortingOption);
    });
  };

  static renderTasks = (taskList, section) => {
    const tasksSection = section.getElementsByClassName('taskList')[0];
    tasksSection.innerHTML = '';
    taskList.tasks.forEach(task => {
      Task.render(task, tasksSection);
    });
  };
}

const comparator = (field, isAsc) => (task1, task2) => {
  if (task1[field] < task2[field]) {
    return isAsc ? -1 : 1;
  }

  if (task1[field] > task2[field]) {
    return isAsc ? 1 : -1;
  }

  return 0;
};

export const SORTING_TYPE = {
  DESCRIPTION_ASC: {
    label: 'Text (Asc)',
    field: 'description',
    isAsc: true,
  },
  DESCRIPTION_DESC: {
    label: 'Text (Desc)',
    field: 'description',
    isAsc: false,
  },
  CREATION_DATE_ASC: {
    label: 'Date creation (Asc)',
    field: 'creationDate',
    isAsc: true,
  },
  CREATION_DATE_DESC: {
    label: 'Date creation (Desc)',
    field: 'creationDate',
    isAsc: false,
  },
  RESOLUTION_DATE_ASC: {
    label: 'Date resolution (Asc)',
    field: 'resolutionDate',
    isAsc: true,
  },
  RESOLUTION_DATE_DESC: {
    label: 'Date resolution (Desc)',
    field: 'resolutionDate',
    isAsc: true,
  },
};

export default TaskList;
