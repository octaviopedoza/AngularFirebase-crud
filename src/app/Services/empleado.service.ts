/*Los servicios se utilizan para realizar varias cosas, una seria para comunicarnos con el backend, otra seria para reutilizar codigo
y otra mas es para comunicarse entre componentes. */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

/* importamos dentro del archivo la clase AngularFirestore que instalamos anteriormente en nuestro proyecto, una vez realizado esto
inyectamos una variable privada de tipo AngularFirestore dentro de nuestro constructor para poder utilizarla */
  constructor(private firestore: AngularFirestore) { }

/* Creamos un metodo para agregar a los empleados que va a recibir como parametro un empleado de tipo "any", este metodo nos va a 
retornar nustra variable privada "firestore" y le vamos a indicar que queremos que nos cree una nueva coleccion dentro de firebase
utilizando la palabra reserveda "collecction" y le pasamos el nombre de la coleccion dentro del parentesis y con el metodo "add"
vamos a agrehgarle el empleado que esta recibiendo porparametro el metodo "agregarEmpledo". 
Como este metodo retorna una promesa podemos tipificar diciendo que el metodo va a a retornar una Promesa<any>*/
  agregarEmpleado(empleado: any): Promise<any>{
    return this.firestore.collection('empleados').add(empleado);
  }

/*Construccion de servicio para consumir empleados, este metodo hace una peticion a firestore directamente a la coleccion de empleados
con "this.firestore.collection('empleados')" y vamos tambien a hacer uso del metodo ".snapshotChanges()" el cual nos va a permitir ver
en tiempo real cada vez que se inserte un dato, este metodo devuelve un observable por lo cual podemos tipificar el servicio con
"Observable<any>", para que no nos devuelva un error debemos de tener importada la libreria  "import { Observable } from 'rxjs';" */
getEmpleados(): Observable<any> {
  return this.firestore.collection('empleados', ref => ref.orderBy('fechaCreate','desc')).snapshotChanges();
}

deleteEmpleado(id:string): Promise<any>{
  return this.firestore.collection('empleados').doc(id).delete();
}

getEmpleado(id:string): Observable<any>{
  return this.firestore.collection('empleados').doc(id).snapshotChanges();
}

actualizaeEmpleado(id:string, data:any): Promise<any>{
  return this.firestore.collection('empleados').doc(id).update(data);
}

}
