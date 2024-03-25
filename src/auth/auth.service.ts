import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { StaffService } from 'src/staff/staff.service';
import { LoginInputDto } from './dtos/login-input.dto';
import { EmployeeEntity } from 'src/staff/entities/employee.entity';
import { LoginOutputDto } from './dtos/login-output.dto';
import { EmployeeDto } from 'src/staff/dtos/employee.dto';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInputDto): Promise<LoginOutputDto> {
    let employee: EmployeeEntity | null;
    if (loginInput.employeeId) {
      employee = await this.staffService.findOne(loginInput.employeeId);
    } else if (loginInput.employeeEmail) {
      employee = await this.staffService.findOneByEmail(
        loginInput.employeeEmail,
      );
    } else {
      employee = await this.staffService.findOneByDni(loginInput.employeeDni!);
    }

    if (!employee) {
      throw new Error('Employee not found');
    }
    if (!(await bcrypt.compare(loginInput.password, employee.password))) {
      throw new Error('Invalid password');
    }

    return {
      employee: EmployeeDto.fromEntity(employee),
      token: await this.jwtService.signAsync({ employeeId: employee.id }),
    };
  }
}
