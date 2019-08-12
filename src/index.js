import './style.css';
import Task from './entities/task';
import TaskList, { SORTING_TYPE } from './entities/taskList';

const openedTasksSection = document.getElementById('openTasks');
const resolvedTasksSection = document.getElementById('resolvedTasks');
const addTaskForm = document.getElementById('addNewTask');

const clearOpenListButton = document.getElementById('clearOpenList');
const clearResolvedListButton = document.getElementById('clearResolvedList');

const openTasksSelect = document.getElementById('openTasksSortings');
const resolvedTasksSelect = document.getElementById('resolvedTasksSortings');

const searchBar = document.getElementById('searchBar');
const mainArea = document.getElementById('mainArea');

const openedTasksList = document.getElementById('openTasksList');
const resolvedTasksList = document.getElementById('resolvedTasksList');

const openTasksStoraged = 'openTasks';
const resolvedTasksStoraged = 'resolvedTasks';

const openTasks = new TaskList({
  tasks: [
    new Task({ description: '1 a' }),
    new Task({ description: '2' }),
    new Task({ description: '3' }),
  ],
  availableSortingTypes: [
    SORTING_TYPE.DESCRIPTION_ASC,
    SORTING_TYPE.DESCRIPTION_DESC,
    SORTING_TYPE.CREATION_DATE_ASC,
    SORTING_TYPE.CREATION_DATE_DESC,
  ],
});

const resolvedTasks = new TaskList({
  tasks: [
    new Task({ description: 'task a' }),
    new Task({ description: 'task b' }),
  ],
  availableSortingTypes: [
    SORTING_TYPE.DESCRIPTION_ASC,
    SORTING_TYPE.DESCRIPTION_DESC,
    SORTING_TYPE.RESOLUTION_DATE_ASC,
    SORTING_TYPE.RESOLUTION_DATE_DESC,
  ],
});

TaskList.renderSortings(openTasks, openedTasksSection);
TaskList.renderTasks(openTasks, openedTasksSection);

TaskList.renderSortings(resolvedTasks, resolvedTasksSection);
TaskList.renderTasks(resolvedTasks, resolvedTasksSection);

const addNewTask = event => {
  event.preventDefault();

  let newTaskDescriptionInput = event.target.getElementsByTagName('input')[0];
  const newTask = new Task({ description: newTaskDescriptionInput.value });
  newTaskDescriptionInput.value = '';

  openTasks.addTask(newTask);
  openTasks.sortList(openTasks.selectedSortingType);
  TaskList.renderTasks(openTasks, openedTasksSection);
};

addTaskForm.addEventListener('submit', addNewTask);

const clearTaskList = (listToClear, sectionToWipe) => event => {
  listToClear.wipeList();
  TaskList.renderTasks(listToClear, sectionToWipe);
};

clearOpenListButton.addEventListener(
  'click',
  clearTaskList(openTasks, openedTasksSection),
);

clearResolvedListButton.addEventListener(
  'click',
  clearTaskList(resolvedTasks, resolvedTasksSection),
);

const sortTaskList = (listToSort, sectionToSort) => event => {
  const newSortingType =
    listToSort.availableSortingTypes[event.target.selectedIndex];
  listToSort.sortList(newSortingType);
  TaskList.renderTasks(listToSort, sectionToSort);
};

openTasksSelect.addEventListener(
  'change',
  sortTaskList(openTasks, openedTasksSection),
);

resolvedTasksSelect.addEventListener(
  'change',
  sortTaskList(resolvedTasks, resolvedTasksSection),
);

const filterTaskLists = event => {
  const searchTerm = event.target.value;

  const filteredOpenTasks = openTasks.filterList(searchTerm);
  const searchOpenCopy = { ...openTasks };
  searchOpenCopy.tasks = filteredOpenTasks;
  TaskList.renderTasks(searchOpenCopy, openedTasksSection);

  const filteredResolvedTasks = resolvedTasks.filterList(searchTerm);
  const searchResolvedCopy = { ...resolvedTasks };
  searchResolvedCopy.tasks = filteredResolvedTasks;
  TaskList.renderTasks(searchResolvedCopy, resolvedTasksSection);
};

searchBar.addEventListener('keyup', filterTaskLists);

const toggleTask = event => {
  let checkbox = event.target.closest('input');
  if (!checkbox) {
    return;
  }

  if (checkbox.type !== 'checkbox') {
    return;
  }

  if (
    !openedTasksList.contains(checkbox) &&
    !resolvedTasksList.contains(checkbox)
  ) {
    return;
  }

  const resolved = event.target.checked;
  const taskId = event.target.parentElement['data-id'];
  if (resolved) {
    const toggledTask = openTasks.getTask(taskId);
    toggledTask.resolutionDate = new Date();
    toggledTask.resolved = true;
    openTasks.removeTask(taskId);
    resolvedTasks.addTask(toggledTask);
  } else {
    const toggledTask = resolvedTasks.getTask(taskId);
    toggledTask.resolutionDate = null;
    toggledTask.resolved = false;
    resolvedTasks.removeTask(taskId);
    openTasks.addTask(toggledTask);
  }

  openTasks.sortList(openTasks.selectedSortingType);
  TaskList.renderTasks(openTasks, openedTasksSection);
  resolvedTasks.sortList(resolvedTasks.selectedSortingType);
  TaskList.renderTasks(resolvedTasks, resolvedTasksSection);
};

openedTasksList.addEventListener('click', toggleTask);
resolvedTasksList.addEventListener('click', toggleTask);

const editTask = (taskList, editSection) => event => {
  let description = event.target.closest('span');
  if (!description) {
    return;
  }

  if (description.className !== 'description') {
    return;
  }

  if (!editSection.contains(description)) {
    return;
  }

  const taskRow = event.target.parentElement;
  const taskId = taskRow['data-id'];
  const editedTask = taskList.getTask(taskId);

  const input = document.createElement('input');
  input.value = editedTask.description;
  input.className = 'description';
  taskRow.insertBefore(input, description);

  description.style.display = 'none';
};

openedTasksList.addEventListener(
  'dblclick',
  editTask(openTasks, openedTasksSection),
);
resolvedTasksList.addEventListener(
  'dblclick',
  editTask(resolvedTasks, resolvedTasksSection),
);

const approveEdit = (taskList, editSection) => event => {
  const keyName = event.key;
  if (keyName !== 'Enter') {
    return;
  }

  const taskRow = event.target.parentElement;
  const taskId = taskRow['data-id'];
  const editedTask = taskList.getTask(taskId);
  editedTask.description = event.target.value;

  const description = taskRow.getElementsByTagName('span')[0];
  description.style.display = 'block';

  taskRow.removeChild(event.target);

  openTasks.sortList(taskList, editSection);
  TaskList.renderTasks(taskList, editSection);
};

openedTasksList.addEventListener(
  'keyup',
  approveEdit(openTasks, openedTasksSection),
);
resolvedTasksList.addEventListener(
  'keyup',
  approveEdit(resolvedTasks, resolvedTasksSection),
);

const rollBackEdit = event => {
  const keyName = event.key;
  if (keyName !== 'Escape') {
    return;
  }

  const editArea = mainArea.querySelector('input.description');
  if (!editArea) {
    return;
  }

  const taskElement = editArea.parentElement;
  taskElement.removeChild(editArea);

  taskElement.querySelector('span.description').style.display = 'block';
};

document.addEventListener('keyup', rollBackEdit);

const deleteTask = (taskList, deleteSection) => event => {
  let deleteButton = event.target.closest('button');
  if (!deleteButton) {
    return;
  }

  if (deleteButton.className !== 'deleteButton') {
    return;
  }

  if (!deleteSection.contains(deleteButton)) {
    return;
  }

  const taskId = event.target.parentElement['data-id'];
  taskList.removeTask(taskId);
  TaskList.renderTasks(taskList, deleteSection);
};

openedTasksList.addEventListener(
  'click',
  deleteTask(openTasks, openedTasksSection),
);
resolvedTasksList.addEventListener(
  'click',
  deleteTask(resolvedTasks, resolvedTasksSection),
);
