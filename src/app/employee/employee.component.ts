import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from 'src/models/dept';
import { Employee } from 'src/models/employee';
import { moveSyntheticComments } from 'typescript';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name', 'department', 'joining_date']
  distinctNames: string[] = [];
  distinctDepts: Department[] = [];
  trueSource: Employee[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild ('mod') mod!: TemplateRef<any>; 

  constructor(private service: EmployeeService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.getResponse().subscribe(r => {
      this.trueSource = r;
      this.dataSource = new MatTableDataSource(this.trueSource);
      this.distinctNames = Array.from(new Set(this.trueSource.map(e => e.name)));
      this.distinctDepts = this.setDistinctDepts(this.trueSource);
      alert('Click on Table headers to enable soring. Enjoy!!!');
    })
  }
  filterByName(target: HTMLInputElement) {
    if (target.value && this.distinctNames.includes(target.value)) {
      this.dataSource = new MatTableDataSource(this.trueSource.filter(e => e.name === target.value));
    } else if (target.value) {
      alert('Please enter a valid name');
    }
  }
  openMod() {
    this.modalService.open(this.mod);
  }
  filterDept(dept: MatSelectChange) {
    this.dataSource = new MatTableDataSource(this.trueSource.filter(e => !dept.value.includes(e.department)));
  }
  clear() {
    this.dataSource = new MatTableDataSource(this.trueSource);
  }
  filterExp(bool: boolean) {
    if (bool) {
      this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => this.calculateDiff(e.joining_date) > 730));
    } else {
      this.dataSource = new MatTableDataSource(this.trueSource);
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  sortData(s: Sort) {
    const isAsc = s.direction === 'asc' ? true : false;
    this.dataSource.data.sort((a: Employee,b: Employee) => {
      return this.employeeSort (a, b, s.active, isAsc);
    })
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }
  employeeSort (a: Employee, b: Employee, state: string, isAsc: boolean, ): number {
    if (a[state] < b[state]) {
      return isAsc ? -1 : 1;
    } else if (a[state] === b[state]) {
      return 0;
    } else if (a[state] > b[state]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  }

  setDistinctDepts(list: Employee[]) {
    const toReturn:Department[] = [];
    const uniqueByDept = Array.from(new Set(list.map(e => e.department)));
    uniqueByDept.forEach(d => {
      const dept: Department = {
        name: d,
        enrolled: list.filter(e => e.department === d).length
      }
      toReturn.push(dept);
    })
    return toReturn;
  }
  calculateDiff(dateSent: Date): number{
    let currentDate = new Date();

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
}
}
