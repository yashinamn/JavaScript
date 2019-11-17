"use strict";


/***настройки 
 * @property {int} rowsCount Количество строк.
 * @property {int} colsCount Количество колонок.
 * @property {int} speed Скорость змейки.
 * @property {int} winLength Длина змейки для победы.
 */
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
    gameCount: 0
};


/**конфигурации 
 ** Объект конфига игры, содержащий методы получения настроек и проверки этих настроек.
 * @property {settings} settings Настройки игры.
 */
const config = {
    settings,
    /***инициализация конфигураций  
     * Инициализация настроек игры.
     * @param {Object} userSettings Объект с пользовательскими настройками игры.
     */
    init(userSettings) { //принимаем пользовательские настройки
        Object.assign(this.settings, userSettings); //копируем пользовательские настройки и добавляем их в общие настройки
    },

    /**метод геттер количества строк */
    getRowsCount() {
        return this.settings.rowsCount;
    },
    /**метод геттер количества столбцов */
    getColsCount() {
        return this.settings.colsCount;
    },
    /**метод геттер показателя скорости */
    getSpeed() {
        return this.settings.speed;
    },
    /**метод геттер количества еды , которую надо съесть чтоб выиграть */
    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    /**метод валидации 
     *  * Проверка значений настроек игры.
     * @returns {{isValid: boolean, errors: Array}} Результат валидации в виде объекта с ошибками.
     */
    validate() {
        /**
         * Объект DTO с результатами валидации.
         * @property {boolean} isValid true, если настройки валидны, иначе false.
         * @property {string[]} errors массив со всеми ошибками настроек.
         */
        const result = {
            isValid: true, //свойство валидности
            errors: [], //массив ошибок
        };

        if (this.settings.speed < 1 || this.settings.speed > 10) { //если скорость не валидна
            result.isValid = false; //свойство валидности - ошибка
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].') //добавляем в массив ошибок новый элемент
        }

        if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) { //если количество строк не валидно
            result.isValid = false; //свойство валидности - ошибка
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].') //добавляем в массив ошибок новый элемент
        }

        if (this.settings.colsCount < 10 || this.settings.colsCount > 30) { //если количство столбцов не валидно
            result.isValid = false; //свойство валидности - ошибка
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].') //добавляем в массив ошибок новый элемент
        }
        return result;
    },

};


/**карта * Объект карты с методами отображения и создания игрового поля.
 * @property {Object} cells Объект содержащий все ячейки игры.
 * @property {Array} usedCells Массив содержащий все занятые ячейки игры.
 */
const map = {
    cell: null, //ячейки
    usedCells: null, //заполненные ячейки массив
    /**инициализация карты 
     * Метод инициализирует и выводит карту для игры.
     * @param {int} rowsCount Количество строк в карте.
     * @param {int} colsCount Количество колонок в карте.
     */
    init(rowsCount, colsCount) { //принимает количество строк и столбцов из конфигурации
        const table = document.getElementById('game'); //находим тэг элемент игры
        table.innerHTML = ""; //делаем его пустым

        this.cells = {}; //объект ячеек
        this.usedCells = []; //массив заполненных ячеек

        for (let row = 0; row < rowsCount; row++) { //цикл всех строк
            const tr = document.createElement('tr'); //созадние тега строки tr
            tr.classList.add('row'); //добавляем класс
            table.appendChild(tr); //добавление тега строки в html-контейнер тег table (id="game")

            for (let col = 0; col < colsCount; col++) { //цикл всех столбцов
                const td = document.createElement('td'); //создание тега колонки td
                td.classList.add('cell'); //добавляем класс

                this.cells[`x${col}_y${row}`] = td; //создаем ключи каждой ячейке тд, чтоб потом доставать

                tr.appendChild(td); //Добавление стобца td в строку tr
            }
        }
    },

    /**метод отрисовки карты рендер, принмает массив точек змейки и точку еды 
     * Отображает все объекты на карте.
     * @param {{x: int, y: int}[]} snakePointsArray Массив с точками змейки.
     * @param {{x: int, y: int}} foodPoint Точка еды.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|Array.prototype.forEach()}
     */
    render(snakePointsArray, foodPoint) {
        // Чистим карту от предыдущего рендера, всем занятым ячейкам оставляем только класс cell.

        for (const cell of this.usedCells) { // для всех ячеек из массива заполненных
            cell.className = 'cell'; //прсваиваем класс и удаляем все другие классы
        }
        // Очищаем массив с занятыми ячейками, при отображении сейчас его соберем заново.
        this.usedCells = []; //массив заполненных ячеек
        snakePointsArray.forEach((point, idx) => { //для массива с ячейками тела змеи применяем функцию форич в которую передаем точку и индекс точки
            const snakeCell = this.cells[`x${point.x}_y${point.y}`]; //Получаем элемент ячейки змейки по точке point.
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody'); //присваиваем ячейкам тела змейки класс тело змеи или голова змеи если это первый элемент массива
            this.usedCells.push(snakeCell); //добавляем в массив заполненных ячеек ячейку с телом змейки
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`]; // Получаем элемент ячейки с едой по точке foodPoint.
        foodCell.classList.add('food'); //присваиваем ячейке еды класс фуд
        this.usedCells.push(foodCell); //добавляем в массив заполненных ячеек ячейку с едой

    },
};


/**змейка 
 * Объект змейки.
 * @property {{x: int, y: int}[]} body Массив с точками тела змейки.
 * @property {string} direction Направление, куда пользователь направил змейку.
 * @property {string} lastStepDirection Направление, куда сходила змейка прошлый раз.
 */
const snake = {
    body: null, //тело змейки
    direction: null, //направление змейки
    lastStopDirection: null,
    /**инициализация змейки 
     *   Инициализирует змейку, откуда она будет начинать и ее направление.
     * @param {{x: int, y: int}[]} startBody Начальная позиция змейки.
     * @param {string} direction Начальное направление игрока.
     */
    init(startBody, startDirection) { //принимаем стартовое положение и направление
        this.body = startBody; //в тело змейки ставим координаты стартовое положение
        this.direction = startDirection; //в анправление ставим направление 
        this.lastStopDirection = startDirection;
    },
    /**
     * Отдает массив со всеми точками змейки.
     * @return {{x: int, y: int}[]};
     */
    getBody() {
        return this.body; //тело змейки массив
    },
    /**
     * Отдает прошлое направление змейки.
     */
    getLastStepDirection() {
        return this.lastStepDirection;
    },

    /**
     * Отдает точку, где будет голова змейки если она сделает шаг.
     * @returns {{x: int, y: int}} Следующая точка куда придет змейка сделав шаг.
     */
    getNextStepHeadPoint() {
        const firstPoint = this.body[0]; //точка головы на данный момент

        switch (this.direction) { //получаем точку дле дальше должна оказаться голова змейки
            case 'up': //направление вверх
                return {
                    x: firstPoint.x, y: firstPoint.y - 1
                };
            case 'right':
                return {
                    x: firstPoint.x + 1, y: firstPoint.y
                };
            case 'down':
                return {
                    x: firstPoint.x, y: firstPoint.y + 1
                };
            case 'left':
                return {
                    x: firstPoint.x - 1, y: firstPoint.y
                };
        }
    },

    /**
     * Проверяет содержит ли змейка переданную точку.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.prototype.some()}
     * @param {{x: int, y: int}} point Точка, которую проверяем.
     * @returns {boolean} true, если змейка содержит переданную точку, иначе false.
     */
    isOnPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y); //перебираем массив тела змейки на премет наличия в ней следующей точки
    },

    /**метод делает шаг */
    makeStep() {
        this.lastStepDirection = this.direction; // Записываем направление движения, которое сейчас произойдет как направление прошлого шага.
        this.body.unshift(this.getNextStepHeadPoint()); //добавляем в массив тела змеи нвоую точку
        this.body.pop(); //удаляем последнюю точку тела змеи
    },

    /**
     * Устанавливает направление змейки.
     * @param {string} direction Направление змейки.
     */
    setDirection(direction) {
        this.direction = direction;
    },

    /**
     * Добавляет в конец тела змейки копию последнего элемента змейки.
     */
    growUp() {
        const lastBodyIdx = this.body.length - 1; // Получаем индекс последней точки в массиве точек змейки (последний элемент this.body).
        const lastBodyPoint = this.body[lastBodyIdx]; // Получаем последнюю точку змейки.
        const lastBodyPointClone = Object.assign({}, lastBodyPoint); // Клонируем последнюю точку змейки (делаем копию).
        this.body.push(lastBodyPointClone); // Добавляем копию в наш массив this.body.
    },
};


/**еда 
 * @property {int} x Координата X еды.
 * @property {int} y Координата Y еды.
 */
const food = {
    x: null,
    y: null,
    /**метод получения координат еды 
     * Отдает координаты еды.
     * @returns {{x: int, y: int}} Координаты еды.
     */
    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },

    /**метод установки координат 
     * @param {{x: int, y: int}} point Новая точка с координатами еды.
     */
    setCoordinates(point) { //принимает точку дто объект
        this.x = point.x;
        this.y = point.y;
    },

    /**
     * Определяет соответствует ли точка на которой находится еда той точке что была передана.
     * @param {{x: int, y: int}} point Точка, для проверки соответствия точке еды.
     * @returns {boolean} true, если точки совпали, иначе false.
     */
    isOnPoint(point) {
        return point.x === this.x && point.y === this.y;
    },
};


/**статус 
 * @property {string} condition Статус игры.
 */
const status = {
    condition: null,
    /**
     * Устанавливает статус в "playing".
     */
    setPaying() {
        this.condition = 'playing';
    },
    /**
     * Устанавливает статус в "stopped".
     */
    setStopped() {
        this.condition = 'stopped';
    },
    /**
     * Устанавливает статус в "finished".
     */
    setFinished() {
        this.condition = 'finished';
    },
    /**
     * Проверяет является ли статус "playing".
     * @returns {boolean} true, если статус "playing", иначе false.
     */
    isPlaying() {
        return this.condition === 'playing';
    },
    /**
     * Проверяет является ли статус "stopped".
     * @returns {boolean} true, если статус "stopped", иначе false.
     */
    isStopped() {
        return this.condition === 'stopped';
    },
};

/**
 * Объект игры.
 * @property {settings} settings Настройки игры.
 * @property {map} map Объект отображения.
 * @property {snake} snake Объект змейки.
 * @property {food} food Объект еды.
 * @property {status} status Статус игры.
 * @property {int} tickInterval Номер интервала игры.
 */
const game = {
    config,
    map,
    snake,
    food,
    status,
    tickInterval: null,
    /**инициализации игры 
     * @param {object} userSettings Настройки игры, которые можно изменить.
     */
    init(userSettings) {
        this.config.init(userSettings); //инициализация конфигураций с пользовательскими настройками

        const validation = this.config.validate(); //переменная валидации

        if (!validation.isValid) { //если валидаия не прошла
            for (const err of validation.errors) { //в массиве ошибок перебираем каждую
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount()); //запускаем инициализацию карты(переменные передаем количество строк и колонок)
        this.setEventHandlers(); // Устанавливаем обработчики событий.
        this.reset(); //запускаем очистку перeд новой игрой
        
    },

    /**метод очистки ячеек игра в начальное положение */
    reset() {
        this.stop(); //ставим стоп игры
        this.snake.init(this.getStartSnakeBody(), 'up'); //ставим змейку в начало
        this.food.setCoordinates(this.getRandomFreeCoordinates()); //еду в нач положение принимает точку случайную
        this.resetCount();   //обнуляем счет    
        this.render(); //отрисовываем
    },

    /**установка нулевого счета*/
    resetCount() {
        this.config.settings.gameCount = 0; //обнуляем счет
        document.getElementById('gameTab').innerHTML = `${this.config.settings.gameCount}`;////обнуляем счет
    },

    /**установка статуса игры */
    play() {
        this.status.setPaying(); //устанавливаем статус играем
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed()); //ставим интервал
        this.setPlayButton('Стоп'); //устанавливаем на кнопку слово "стоп"
    },
    /**установка статуса остановки игры */
    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval); // Убираем интервал шагов змейки.
        this.setPlayButton('Старт'); //устанавливаем на кнопку слово "старт"
    },
    /**установка статуса окончания игры */
    finish() {
        this.status.setFinished(); // Ставим статус в 'finished'
        clearInterval(this.tickInterval); // Убираем интервал шагов змейки.
        this.setPlayButton('Игра завершена', true); //устанавливаем на кнопку слова "Игра завершена"
    },
    /**
     * Обработчик события тика игры, когда змейка должна перемещаться.
     */
    tickHandler() {
        // Если следующий шаг невозможен, то ставим игру в статус завершенный.

        if (!this.canMakeStep()) {
            return this.finish();
        }
        // Если следующий шаг будет на еду, то заходим в if.
        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            // Прибавляем к змейке ячейку.
            this.snake.growUp();
            this.setGameCount();
            // Ставим еду в свободную ячейку.
            this.food.setCoordinates(this.getRandomFreeCoordinates());
            // Если выиграли, завершаем игру.
            if (this.isGameWon()) {
                this.finish();
            }
        }
        // Перемещаем змейку.
        this.snake.makeStep();
        // Отрисовываем что получилось после шага.
        this.render();
    },
  /**
     * увеличиваем счет игры. 
     * @param {string} textContent Текст кнопки.
     * @param {boolean} [isDisabled = false] Необходимо ли заблокировать кнопку.
     */
    setGameCount() {
        const count = ++this.config.settings.gameCount;//увеличиваем счет игры в настройках
        const gameTab = document.getElementById('gameTab'); //находим табло
        gameTab.innerHTML = `${count}`;//выводим счет на табло
    },
    /**
     * Меняем кнопку с классом playButton.
     * @param {string} textContent Текст кнопки.
     * @param {boolean} [isDisabled = false] Необходимо ли заблокировать кнопку.
     */
    setPlayButton(textContent, isDisabled = false) { //передаем текст и надо ли кнопку сделать серой
        const playButton = document.getElementById('playButton'); //находим кнопку
        playButton.textContent = textContent; //ставим ей текст
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled'); //если надо ее сделать серой, то ставим класс дисэйблед, иначе убираем этот класс 
    },

    /**
     * Возвращает начальную позицию змейки в центре карты.
     * @returns {{x: int, y: int}[]} Точка начальной позиции змейки.
     */
    getStartSnakeBody() {
        return [{ //возвращает
            x: Math.floor(this.config.getColsCount() / 2), //положение по х
            y: Math.floor(this.config.getRowsCount() / 2), //положение по у
        }];
    },

    /**
     * Ставит обработчики события.
     */
    setEventHandlers() { //ставим обработчик события
        // При клике на кнопку с классом playButton вызвать функцию this.playClickHandler.
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        // При клике на кнопку с классом newGameButton вызвать функцию this.newGameClickHandler.
        document.getElementById('newGameButton').addEventListener('click', () => this.newGameClickHandler());
        // При нажатии кнопки, если статус игры "играем", то вызываем функцию смены направления у змейки.
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },
    /**
     * Отображает все для игры, карту, еду и змейку.
     */
    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates());
    },

    /**метод  получения точки, случайных свободных сооринат для еды */
    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody()]; //сначала создаем массив точек,которые заняты едой и телом змейки

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()), //округляем случйное число
                y: Math.floor(Math.random() * this.config.getRowsCount()), //округляем случайное число
            };

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) { //условие если в массиве заполненных точек нет нашей случайной точки
                return rndPoint; //то возвращаем эту точку
            }
        }
    },


    /**
     * Обработчик события нажатия на кнопку playButton.
     */
    playClickHandler() {
        // Если сейчас статус игры "играем", то игру останавливаем, если игра остановлена, то запускаем.
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    /**
     * Обработчик события нажатия на кнопку "Новая игра".
     */
    newGameClickHandler() {
        // Ставим игру в начальное положение.
        this.reset();
    },
    /**
     * Обработчик события нажатия кнопки клавиатуры.
     * @param {KeyboardEvent} event
     */
    keyDownHandler(event) {
        // Если статус игры не "играем", значит обрабатывать ничего не нужно.
        if (!this.status.isPlaying()) {
            return;
        }
        // Получаем направление змейки, больше мы не обрабатываем других нажатий.
        const direction = this.getDirectionByCode(event.code);
        // Змейка не может повернуть на 180 градусов, поэтому делаем проверку, можем ли мы назначить направление.
        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    /**
     * Отдает направление змейки в зависимости от переданного кода нажатой клавиши.
     * @param {string} code Код нажатой клавиши.
     * @returns {string} Направление змейки.
     */
    getDirectionByCode(code) {
        switch (code) { //код клавиши
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },


    /**
     * Определяет можно ли назначить переданное направление змейке.
     * @param {string} direction Направление, которое проверяем.
     * @returns {boolean} true, если направление можно назначить змейке, иначе false.
     */
    canSetDirection(direction) {
        // Получаем прошлое направление змейки.
        const lastStepDirection = this.snake.getLastStepDirection();
        // Если прошлое направление змейки не противоположное от direction, возвращаем true.
        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right'
    },

    /**
     * Проверяем произошла ли победа, судим по очкам игрока (длине змейки).
     * @returns {boolean} true, если игрок выиграл игру, иначе false.
     */
    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },
    /**
     * Проверяет возможен ли следующий шаг.
     * @returns {boolean} true если следующий шаг змейки возможен, false если шаг не может быть совершен.
     */
    canMakeStep() {
        // Получаем следующую точку головы змейки в соответствии с текущим направлением.
        const nextHeadPoint = this.snake.getNextStepHeadPoint();
        // Змейка может сделать шаг если следующая точка не на теле змейки и точка внутри игрового поля.
        return !this.snake.isOnPoint(nextHeadPoint) && // не находится ли след точка на теле змейки
            nextHeadPoint.x < this.config.getColsCount() && //точка находится внутри поля по х
            nextHeadPoint.y < this.config.getRowsCount() && //точка находится внутри поля по у
            nextHeadPoint.x >= 0 && //точка находится внутри поля по х
            nextHeadPoint.y >= 0; //точка находится внутри поля по у
    },

};

/**запуск игры */
game.init({
    speed: 6,
    winFoodCount: 5
}); //меняем скорость на 5