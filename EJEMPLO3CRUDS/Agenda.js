import Employee from "./Employee.js";

export default class Agenda {
  constructor(tableAgenda, tableInfo) {
    this._tableAgenda = tableAgenda;
    this._tableInfo = tableInfo;
    this._numEmployees = 0;
    this._sumAge = 0;
    this._employees = [];
    //this._employees = new Map(); //Vector con ID en cada valor
    localStorage.removeItem("employees");

    this._initTables();
  }

  _initTables() {
    let lsEmployees = JSON.parse(localStorage.getItem("employees"));

    if (lsEmployees === null) {
      return;
    }

    // for (var e of lsEmployees.keys()){ //guarda cada valor del array uno por uno en e
    //   this._addToTable(new Employee(e));
    // }

   lsEmployees.forEach((e, index) => { //Para probar localstorage sin esto
      e.birthday = new Date(e.birthday);
      this._addToTable(new Employee(employee));
    })
    
  }

  _addToTable(employee) {
    let row = this._tableAgenda.insertRow(-1);

    let cellName = row.insertCell(0);
    let cellEmail = row.insertCell(1);
    let cellBirthday = row.insertCell(2);
    let cellAge = row.insertCell(3);
    let cellEdit = row.insertCell(4);
    let cellDelete = row.insertCell(5);

    

    cellName.innerHTML = employee.name;
    cellEmail.innerHTML = employee.email;
    cellBirthday.innerHTML = employee.getBirthdayAsString();
    cellAge.innerHTML = employee.getAge();

    this._addButtons(row, employee); //metodo de botones
    


    this._numEmployees++; // this._numEmployees = this._numEmployees + 1
    this._sumAge += employee.getAge(); // this._sumAge = this._sumAge + employee.getAge()

    this._tableInfo.rows[0].cells[1].innerHTML = this._numEmployees;

    this._tableInfo.rows[1].cells[1].innerHTML =
      this._sumAge / this._numEmployees;

    let objEmployee = {
      name: employee.name,
      email: employee.email,
      birthday: employee.birthday
    };

    this._employees.push(objEmployee); 
    //this._employees.set(objEmployee.email, objEmployee); //clave, valor
  }

  _findEmployee(email){
    let foundAt = -1; //solo lo encuentra desde el 0 en adelante. Por eso se inicializa como -1
    this._employees.forEach((e, index) => {
      if (e.email === email) {
        foundAt = index;
        return;
      }
    });
    return foundAt;
  }

  addEmployee(employee) {
    //buscar empleado:
    let found = this._findEmployee(employee.email);
    if (found >= 0) {
      Swal.fire({
        type: "error",
        title: "Error",
        text: "El correo ya existe" 
      });
      return;
    }
    this._addToTable(employee);
    console.log(this._employees);
    localStorage.setItem("employees", JSON.stringify(this._employees));

  }







    _addButtons(row, employee){ //metodo de botones
      let btnEdit = document.createElement("input");
      btnEdit.type = "button";
      btnEdit.value = "Editar";
      btnEdit.className = "btn btn-warning";
      btnEdit.addEventListener("click", () => { 
        this._editRow(row, employee); //llamando al metodo de editar
      });
  
      let btnDelete = document.createElement("input");
      btnDelete.type = "button";
      btnDelete.value = "Eliminar";
      btnDelete.className = "btn btn-danger";

      row.cells[4].appendChild(btnEdit);
      row.cells[5].appendChild(btnDelete);
    }

  _editRow(row, employee){ //metodo para editar
    console.log(row, employee);
    let inputName = document.createElement("input"); //convertir la celda en input para editar
    inputName.type = "text";
    inputName.value = employee.name; 

    let inputCorreo = document.createElement("input");
    inputCorreo.type = "text";
    inputCorreo.value = employee.email;

    let inputFecha = document.createElement("input");
    inputFecha.type = "date";
    inputFecha.value = employee.getBirthdayForDate();

    row.cells[0].innerHTML = ""; //borrar la celda
    row.cells[0].appendChild(inputName); //appendChild para crear un input através de una variable  

    row.cells[1].innerHTML = "";
    row.cells[1].appendChild(inputCorreo);

    row.cells[2].innerHTML = "";
    row.cells[2].appendChild(inputFecha);
    

    //crear botones

    let btnSave = document.createElement("input");
    btnSave.type = "button";
    btnSave.value = "Guardar";
    btnSave.className = "btn btn-warning";
    row.cells[4].innerHTML = "";
    row.cells[4].appendChild(btnSave);
    btnSave.addEventListener("click", () => {
      let newEmployee ={
        name : inputName.value,
        email : inputCorreo.value,
        birthday : inputFecha.value
      }
      this._saveEdit(row, employee,newEmployee);
    });

    let btnCancel = document.createElement("input");
    btnCancel.type = "button";
    btnCancel.value = "Cancelar";
    btnCancel.className = "btn btn-danger";
    row.cells[5].innerHTML = "";
    row.cells[5].appendChild(btnCancel);
    btnCancel.addEventListener("click", () => {
      this._cancelEdit(row, employee); //llamar metodo
    });

  }

  _cancelEdit(row, employee){
    row.cells[0].innerHTML = employee.name;
    row.cells[1].innerHTML = employee.email;
    row.cells[2].innerHTML = employee.getBirthdayAsString();

    row.cells[4].innerHTML = "";
    row.cells[5].innerHTML = "";
     this._addButtons(row, employee); //metodo de botones
  }

  _saveEdit(row, employee,newEmployee){
      let position = this._findEmployee(employee.email);
      this._employees[position] = newEmployee;
      localStorage.setItem("employees", JSON.stringify(this._employees));

      this._cancelEdit(row, new Employee(newEmployee));
  }
}