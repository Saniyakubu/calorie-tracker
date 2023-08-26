class calorieTracker {
  constructor() {
    this._calorieLimit = storage.getCalorieLimit();
    this._totalCalorie = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCalorieTotoal();
    this._displayCalorieLimit();
    this._displayCalorieconsumed();
    this._displayCalorieBurned();
    this._displayCalorieRemaining();
    this._displayCalorieProgress();
  }

  addMeal(meals) {
    this._meals.push(meals);
    this._totalCalorie += meals.calories;
    this._displayNewMeal(meals);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalorie -= workout.calories;
    this._displayNewWorkout(workout);
    this._render();
  }

  RemoveMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== 1) {
      const meal = this._meals[index];
      this._totalCalorie -= meal.calories;
      this._meals.splice(index, 1);
      this._render();
    }
  }

  RemoveWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== 1) {
      const workout = this._workouts[index];
      this._totalCalorie += workout.calories;
      this._workouts.splice(index, 1);
      this._render();
    }
  }
  reset() {
    this._meals = [];
    this._workouts = [];
    this._totalCalorie = 0;
    this._render();
  }
  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    this._displayCalorieLimit();
    this._render();
  }
  _displayCalorieTotoal() {
    const calorieTotal = document.getElementById('calories-total');
    calorieTotal.innerHTML = this._totalCalorie;
  }
  _displayCalorieLimit() {
    const calorieTotal = document.getElementById('calories-limit');
    calorieTotal.innerHTML = this._calorieLimit;
  }
  _displayCalorieconsumed() {
    const calorieConsumed = document.getElementById('calories-consumed');
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    console.log(consumed);
    calorieConsumed.innerHTML = consumed;
  }

  _displayCalorieBurned() {
    const calorieburned = document.getElementById('calories-burned');
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    console.log(burned);
    calorieburned.innerHTML = burned;
  }
  _displayCalorieRemaining() {
    const calorieRemainingEl = document.getElementById('calories-remaining');
    const progressEl = document.getElementById('calorie-progress');
    const calorieRemaining = this._calorieLimit - this._totalCalorie;
    console.log(calorieRemaining);

    calorieRemainingEl.innerHTML = calorieRemaining;
    if (calorieRemaining <= 0) {
      calorieRemainingEl.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      calorieRemainingEl.parentElement.parentElement.classList.add('bg-danger');
      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      calorieRemainingEl.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      calorieRemainingEl.parentElement.parentElement.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }
  }
  _displayCalorieProgress() {
    const calorieParcentageEl = document.getElementById('calorie-progress');
    const parcentage = (this._totalCalorie / this._calorieLimit) * 100;
    const width = Math.min(parcentage, 100);
    console.log(parcentage);
    console.log(width);
    calorieParcentageEl.style.width = `${width}%`;
  }

  _displayNewMeal(meals) {
    const mealsEl = document.getElementById('meal-items');
    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meals.id);
    mealEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meals.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${meals.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById('workout-items');
    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);
    workoutEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    workoutsEl.appendChild(workoutEl);
  }

  _render() {
    this._displayCalorieTotoal();
    this._displayCalorieconsumed();
    this._displayCalorieBurned();
    this._displayCalorieRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }
}

class App {
  constructor() {
    this._tracker = new calorieTracker();
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newMeal.bind(this));
    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newWorkout.bind(this));
    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeMeal.bind(this));
    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeWorkout.bind(this));
    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterMeals.bind(this));
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterWorkout.bind(this));
    document
      .getElementById('reset')
      .addEventListener('click', this._rest.bind(this));
    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newMeal(e) {
    console.log(e.preventDefault());
    e.preventDefault();

    const name = document.getElementById('meal-name');
    const calorie = document.getElementById('meal-calories');

    if (name.value === '' || calorie.value === '') {
      alert('please fill in the fiel');
      return;
    }

    const meal = new Meal(name.value, +calorie.value);

    this._tracker.addMeal(meal);

    name.value = '';
    calorie.value = '';

    const collapseMeal = document.getElementById('collapse-meal');
    const bsCollapse = new bootstrap.Collapse(collapseMeal, {
      toggle: true,
    });
  }

  _newWorkout(e) {
    console.log(e.preventDefault());
    e.preventDefault();

    const name = document.getElementById('workout-name');
    const calorie = document.getElementById('workout-calories');

    if (name.value === '' || calorie.value === '') {
      alert('please fill in the fiel');
      return;
    }

    const workout = new Workout(name.value, +calorie.value);

    this._tracker.addWorkout(workout);

    name.value = '';
    calorie.value = '';

    const collapseWorkout = document.getElementById('collapse-workout');
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }

  _removeMeal(e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('are you sure')) {
        console.log(e.target);
        const id = e.target.closest('.card').getAttribute('data-id');
        console.log(id);
        this._tracker.RemoveMeal(id);
        e.target.closest('.card').remove();
      }
    }
  }
  _removeWorkout(e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('are you sure')) {
        console.log(e.target);
        const id = e.target.closest('.card').getAttribute('data-id');
        console.log(id);
        this._tracker.RemoveWorkout(id);
        e.target.closest('.card').remove();
      }
    }
  }

  _filterMeals(e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('#meal-items .card').forEach((items) => {
      const name = items.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        items.style.display = 'block';
      } else {
        items.style.display = 'none';
      }
    });
  }
  _filterWorkout(e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('#workout-items .card').forEach((items) => {
      const name = items.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        items.style.display = 'block';
      } else {
        items.style.display = 'none';
      }
    });
  }
  _rest() {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('please add limit');
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = '';

    const modaEl = document.getElementById('limit-modal');
    const modal = bootstrap.modal.getInstance(modaEl);
    modal.hide();
  }
}

const app = new App();

console.log(document.getElementById('meal-items'));
