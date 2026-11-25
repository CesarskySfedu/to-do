let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
// Загрузка данных из хранилища
function loadTasks() {
	const savedTasks = localStorage.getItem("tasks");

	if (savedTasks !== null) {
		return JSON.parse(savedTasks);
	}

	return items;
}

// Создание объекта задачи  в HTML
function createItem(item) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);
	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	textElement.textContent = item;
	// Переменная для хранения предыдущего текста задачи, чтобы можно было восстановить его при отмене редактирования
	let previousText = item;

	// Обработчик кнопки удаления
	deleteButton.addEventListener("click", function () {
		clone.remove();

		const items = getTasksFromDOM();
		saveTasks(items);
	});

	// Обработчик кнопки дублирования
	duplicateButton.addEventListener("click", function () {
		const newItem = createItem(textElement.textContent);
		listElement.prepend(newItem);

		items = getTasksFromDOM();
		saveTasks(items);
	});

	// Обработчики кнопки редактирования
	editButton.addEventListener("click", function () {
		previousText = textElement.textContent;

		textElement.setAttribute("contenteditable", "true");
		textElement.focus();
	});

	textElement.addEventListener("blur", function () {
		const editedText = textElement.textContent.trim();

		if (!editedText) {
			textElement.textContent = previousText;
		} else {
			textElement.textContent = editedText;
		}

		textElement.setAttribute("contenteditable", "false");

		items = getTasksFromDOM();
		saveTasks(items);
	});



	return clone;
}

// Получение текста задач из DOM
function getTasksFromDOM() {
	const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
	const tasks = [];

	itemsNamesElements.forEach(function (itemElement) {
		tasks.push(itemElement.textContent);
	});

	return tasks;
}

// Запись задач в хранилище
function saveTasks(tasks) {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Создание списка задач
items = loadTasks();

items.forEach(function (item) {
	const newItem = createItem(item);
	listElement.append(newItem);
});

// Обработчик создания новой записи
formElement.addEventListener("submit", function (event) {
	event.preventDefault();

	const item = inputElement.value.trim();

	if (!item) {
		return;
	}

	const newItem = createItem(item);

	listElement.prepend(newItem);

	items = getTasksFromDOM();
	saveTasks(items);

	inputElement.value = "";
});

