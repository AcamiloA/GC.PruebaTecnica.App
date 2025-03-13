import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: any = { nombre: '', apellido: '', cedula: '', correo: '' };
  userId: number = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id')); // Obtener ID de la URL
    this.userService.getUserById(this.userId).subscribe(response => {
      this.user = response.data;
    });
  }

  updateUser() {
    this.userService.updateUser(this.userId, this.user).subscribe(() => {
      this.router.navigate(['/users']); // Redirigir al listado de usuarios
    });
  }
}
