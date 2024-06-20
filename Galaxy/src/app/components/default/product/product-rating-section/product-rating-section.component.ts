import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UnitService } from '../../../../services/unit.service';
import { IProductRating, initProductRating } from '../../../../Models/Rating/rating-product';
import { IRateRead } from '../../../../Models/Rating/rating-read';
import { IUserRead } from '../../../../Models/User/user-read';

@Component({
  selector: 'app-product-rating-section',
  templateUrl: './product-rating-section.component.html',
  styleUrls: ['./product-rating-section.component.css']
})
export class ProductRatingSectionComponent implements OnInit, OnChanges {

  constructor(private unit: UnitService) { }
  ratings: IProductRating = initProductRating;
  showConfirm:boolean = false;

  @Input() productId: number | null = null;
  @Output() UpdateAvgRate: EventEmitter<any> = new EventEmitter<any>();

  page: number = 1;

  ngOnInit(): void {
    this.listienToRateAdded();
  };

  showConfirmFunc = () => this.showConfirm = true;
  

  listienToRateAdded(): void {
    /* Event in order Not to make API call to get the rating Client Side */
    this.unit.rate.listenToRate().subscribe((rate: IRateRead | null) => {

      this.ratings.ratedBefore = rate;
      if (this.unit.isAuthunicated()){

        this.unit.user.GetUser().subscribe((user: IUserRead) => {
          if (rate !== null) {
            this.ratings.ratedBefore!.user = user;
          } else {
            this.ratings.ratedBefore = rate;
          }
        });
      }
    });
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.getProductRating(this.page);
  };

  getProductRating(page: number): void {
    if (this.productId)
      this.unit.rate.GetProductRating(page, this.productId).subscribe((rateData: IProductRating) => {
        this.ratings = rateData;
        this.unit.rate.sendRate(rateData.ratedBefore!);
      });
  };

  DeleteRate(condetion:boolean): void {
    this.showConfirm = false;
    if(condetion)
    this.unit.rate.DeleteRating(this.productId!).subscribe(() => {
      this.UpdateAvgRate.emit();
      this.removeRateClientSide();
      this.unit.rate.sendRate(null);
    })
  };

  removeRateClientSide(): void {
    this.ratings.ratedBefore = null;
  };

}