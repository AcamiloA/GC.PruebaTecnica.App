import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          clasificacion: this.getClasificacion(user.ultimoAcceso),
          puntaje: this.calcularPuntaje(user)
        }));
      },
      error: () => {
        this.errorMessage = 'Error al cargar usuarios.';
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  getClasificacion(ultimoAcceso?: string): string {
    if (!ultimoAcceso) return 'Sin datos';

    const ahora = new Date();
    const acceso = new Date(ultimoAcceso);
    const diferenciaHoras = (ahora.getTime() - acceso.getTime()) / (1000 * 60 * 60);

    if (diferenciaHoras <= 12) {
      return 'Hechicero';
    } else if (diferenciaHoras > 12 && diferenciaHoras <= 48) {
      return 'Luchador';
    } else if (diferenciaHoras > 48 && diferenciaHoras <= 168) {
      return 'Explorador';
    } else {
      return 'Olvidado';
    }
  }

  calcularPuntaje(user: { nombre?: string; apellido?: string; correo?: string }): number {
    let puntaje = 0;
  
    const nombre = user.nombre?.trim() || '';
    const apellido = user.apellido?.trim() || '';
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    const longitudNombre = nombreCompleto.length;
  
    if (longitudNombre > 10) {
      puntaje += 20;
    } else if (longitudNombre >= 5 && longitudNombre <= 10) {
      puntaje += 10;
    }
  
    if (user.correo) {
      const emailParts = user.correo.split('@');
  
      if (emailParts.length === 2) {
        const dominio = emailParts[1].toLowerCase();
        switch (dominio) {
          case 'gmail.com':
            puntaje += 40;
            break;
          case 'hotmail.com':
            puntaje += 20;
            break;
          default:
            puntaje += 10;
        }
      }
    }
  
    return puntaje;
  }
}
