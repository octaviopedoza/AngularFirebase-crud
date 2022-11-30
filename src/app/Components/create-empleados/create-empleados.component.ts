import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from 'src/app/Services/empleado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-empleados',
  templateUrl: './create-empleados.component.html',
  styleUrls: ['./create-empleados.component.css']
})

export class CreateEmpleadosComponent implements OnInit {
  createEmpleado: FormGroup; //creamos una variable de tipo FormGroup que nos va a ayudar a conectar con nuestro html
  submitted = false;
  loading = false;
  id: string | null;
  titulo = "Agregar empleado";

  // inyectamos la clase FormBuilder que nos va a permitir validar el formulario de manera sencilla
  constructor(private fb: FormBuilder,
  /*inyectamos el servicio creado para la comunicacion con el backend (regularmente el nombre empieza con un "_") con esto realizado
  ya tenemos acceso al metodo que acabos de crear dentro de nustro servicio. */
              private _empleadoService: EmpleadoService,
/* Para poder redireccionar a nustro listado de empleados una vez guardado el dato dentro de firebase vamos a hacer uso de la clase
Router por lo cual necesitamos primero importarla para poder hacer uso de ella */
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute) { 
  // indicamos que nustra variable createEmpleados va aser igual a el formBuilder que estamos inyectando que a su vez es de tipo group
  // entre parentesis le vamos a pasar un objeto con las variables de nuestro formulario.
  this.createEmpleado = this.fb.group({
  //1°variable es el valor por defecto que va a tener, 2°las validaciones y decimos que el campo va a ser requerido.
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      puesto: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }  
  ngOnInit(): void {
    this.updateEmpleado()
  }
// Metodo creado para guardar los datos del formulario al momento de dar click sobre el boton submit
  agregarEditarEmpleado(){
    this.submitted = true; //cambiamos el valor de submitted a true (para la validacion del form)
    if(this.createEmpleado.invalid){ //evaluamos si createEmpleado es invalido no dejamos que siga haciendo un return vacio.
      return;
    }
    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }
  }

  agregarEmpleado(){
    /* Creamos una constante de tipo "any" y le vamos a pasar como valores los datos que vengan desde el formulario, la constante va a ser
un objeto dentro del cual cada uno de sus atributos seran cada campo de nuestro formulario y para acceder al dato pasado por formulario
vamos a acceder a formulario usando "this.createEmpleado" y luego vamos a poner ".value.nombre" */
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      puesto: this.createEmpleado.value.puesto,
      fechaCreate: new Date(),
      fechaUpdate: new Date()
    }
/* Accedemos a nuestro servicio usando "this._empleadosService" una vez realizado esto llamamos a nuestro metodo "agregarEmpleados" 
y le pasamos como parametro nustra constante empleado, como esto nos debuelve una promesa vamos a utilizar el "then" y una funcion 
Arrow que nos regresa un console.log indicando que el empleado se guardo correctamente y pudieramos agregar un "catch" para capturar 
algun posible error*/
    this.loading = true;
    this._empleadoService.agregarEmpleado(empleado).then(() => {
      this.toastr.success('Empleado Guardado con exito', 'Empleado registrado');
/* Realizamos el redireccionamiento a nustra lista de empleados una vez que el empleado creado se guardo con exito, accedemos a la 
propiedad del constructor "this.router" y utilizamos el metodo ".navigate" y entre parentesis, corchetes y comillas simples vamos a 
agregar la ruta a donde queremos redireccionar*/
      this.loading = false;
      this.router.navigate(['/list-empleados'])
    }).catch(error => {
      console.log(error);
      this.loading = false;
    })
  }

  editarEmpleado(id: string){
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      puesto: this.createEmpleado.value.puesto,
      fechaUpdate: new Date()
    }

    this.loading = true;
    this._empleadoService.actualizaeEmpleado(id, empleado).then(() => {
      this.loading = false;
      this.toastr.info("Empleado actualizado con exido", "Empleado modificado");
      this.router.navigate(['/list-empleados'])
    })
  }

  updateEmpleado(){
    this.titulo = "Editar Empleado";
    if(this.id !== null){
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        this.loading = false;
        console.log(data.payload.data()['nombre']);
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          puesto: data.payload.data()['puesto'],
        })
      })
    }

  }

}


