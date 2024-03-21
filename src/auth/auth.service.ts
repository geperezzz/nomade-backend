import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { StaffService } from 'src/staff/staff.service';
import { LoginDto } from './dtos/login.dto';
import { EmployeeEntity } from 'src/staff/entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    let employee: EmployeeEntity | null;
    if (loginDto.employeeId) {
      employee = await this.staffService.findOne(loginDto.employeeId);
    } else if (loginDto.employeeEmail) {
      employee = await this.staffService.findOneByEmail(loginDto.employeeEmail);
    } else {
      employee = await this.staffService.findOneByDni(loginDto.employeeDni!);
    }
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    if (!await bcrypt.compare(loginDto.password, employee.password)) {
      throw new Error('Invalid password');
    }
    
    return await this.jwtService.signAsync({ employeeId: employee.id });
  }
}