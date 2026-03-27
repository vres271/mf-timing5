import { Component, Input, Output, EventEmitter, signal, Signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { TableModule } from 'primeng/table';

      // [columns]="columns()"
      // [paginator]="paginator"
      // [rows]="rows"
      // [totalRecords]="totalRecords()"
      // [loading]="loading()"
      // [lazy]="lazy"
      // (onLazyLoad)="onLazyLoad.emit($event)"
      // (onRowSelect)="onRowSelect.emit($event)"
      // (onRowUnselect)="onRowUnselect.emit($event)"
      // [selection]="selection()"
      // (selectionChange)="setSelection($event)"

@Component({
  selector: 'mft-table',
  template: `
    <p-table  [value]="data" [columns]="columns">
        <ng-template #header let-columns>
          <tr>
          @for (col of columns; track $index) {
            <th>{{ col.header }}</th>
          }
          </tr>
        </ng-template>
        <ng-template #body let-row let-columns="columns">
          <tr>
          @for (col of columns; track $index) {
            <td>{{ [].concat(row[col.field]).join(',') }}</td>
          }
          </tr>
        </ng-template>
    </p-table>
  `,
  imports: [TableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = any> {

  @Input() data: T[] = [];
  @Input() columns = [
    // { field: 'id', header: 'ID' },
    { field: 'name', header: 'Имя' },
    { field: 'roles', header: 'roles' },
    { field: 'email', header: 'Email' }
  ]

  // Основные сигналы для данных и колонок
  // private _data = signal<T[]>([]);
  // private _columns = signal<any[]>([]);
  // private _loading = signal(false);
  // private _selection = signal<T[] | T | null>(null);
  // private _totalRecords = signal<number>(0);

  // // Внешние входы
  // @Input() set data(val: T[]) { this._data.set(val ?? []); }
  // data: Signal<T[]> = this._data.asReadonly();

  // @Input() set columns(val: any[]) { this._columns.set(val ?? []); }
  // columns: Signal<any[]> = this._columns.asReadonly();

  // @Input() set loading(val: boolean) { this._loading.set(val); }
  // loading: Signal<boolean> = this._loading.asReadonly();

  // @Input() set selection(val: T[] | T | null) { this._selection.set(val); }
  // selection: Signal<T[] | T | null> = this._selection.asReadonly();

  // @Input() set totalRecords(val: number) { this._totalRecords.set(val); }
  // totalRecords: Signal<number> = this._totalRecords.asReadonly();

  // @Input() paginator = false;
  // @Input() rows = 10;
  // @Input() lazy = false;

  // // Внешние события
  // @Output() onLazyLoad = new EventEmitter<any>();
  // @Output() onRowSelect = new EventEmitter<any>();
  // @Output() onRowUnselect = new EventEmitter<any>();
  // @Output() selectionChange = new EventEmitter<T[] | T | null>();

  // setSelection(val: T[] | T | null) {
  //   this._selection.set(val);
  //   this.selectionChange.emit(val);
  // }
}
