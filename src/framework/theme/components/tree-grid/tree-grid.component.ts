/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  IterableDiffers,
  QueryList,
} from '@angular/core';

import { NB_DOCUMENT } from '../../theme.options';
import { NbPlatform } from '../cdk/platform';
import { NbDirectionality } from '../cdk/bidi';
import { NB_TABLE_TEMPLATE, NbTable } from '../cdk/table';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from './data-source/tree-grid-data-source';
import { NbTreeGridNode, NbTreeGridPresentationNode } from './data-source/tree-grid.model';
import { NbRowComponent } from '../cdk/table';

/**
 * NbTreeGridComponent
 * @stacked-example(Showcase, tree-grid/tree-grid-showcase.component)
 */
@Component({
  selector: 'nb-tree-grid, table[nbTreeGrid]',
  template: NB_TABLE_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbTreeGridComponent<T> extends NbTable<NbTreeGridPresentationNode<T>> implements AfterViewInit {

  // TODO get rid of this
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<T>,
              differs: IterableDiffers,
              changeDetectorRef: ChangeDetectorRef,
              elementRef: ElementRef,
              @Attribute('role') role: string,
              dir: NbDirectionality,
              @Inject(NB_DOCUMENT) document: any,
              platform: NbPlatform  | undefined,
  ) {
    super(differs, changeDetectorRef, elementRef, role, dir, document, platform);
  }

  private _source: NbTreeGridDataSource<T>;

  @Input() set source(data: NbTreeGridNode<T>[]) {
    if (data instanceof NbTreeGridDataSource) {
      this._source = data;
    } else {
      this._source = this.dataSourceBuilder.create(data);
    }
    this.dataSource = this._source;
  }

  @ContentChildren(NbRowComponent) private rows: QueryList<NbRowComponent>;

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  getLevel(row: NbRowComponent): number {
    return this._source.getLevel(this.getRowIndex(row));
  }

  toggle(row: NbRowComponent): void {
    return this._source.toggleByIndex(this.getRowIndex(row));
  }

  private getRowIndex(row: NbRowComponent): number {
    return this.rows.toArray().indexOf(row);
  }
}
