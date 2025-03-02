import { Component, OnInit } from '@angular/core';
import { UnitService } from '../../../services/unit.service';
import { ICartItem } from '../../../Models/Cart-Items/Cart-item-model';
import { IUserRead, initUserRead } from '../../../Models/User/user-read';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private unit: UnitService,private router: Router) { }
  cart: ICartItem[] = [];
  user: IUserRead = initUserRead;
  ordersCount:number = 0;

  ngOnInit() {
    this.GetCart();
    this.getUser();
    this.OrdersCount()
}


  getUser():void {
    this.unit.user.GetUser().subscribe((user: IUserRead) => {
      this.user = user;
    })
  };

  WishListCount():number{
    return this.unit.wishlist.GetwishListCount();
  };

  OrdersCount():void{
    this.unit.order.GetUserDeleverdCount().subscribe((count:number)=>{
this.ordersCount = count;
    });
  };

  FetchCart(): void {
    this.unit.cart.FetchCart();
  };

  GetCart(): void {
    this.unit.cart.GetCart().subscribe((cart: ICartItem[]) => {
      this.cart = cart;
      this.GetCartItemsCount();
    });
  };

  isAuthunticated(): boolean {
    return this.unit.auth.isAuthunicated();
  };

  logoutFunction(): void {
    this.unit.auth.LogoutFunction();
  };

  GetCartItemsCount(): number {
    let count = 0;
    for (let i = 0; i < this.cart?.length; i++) {
      count += +this.cart[i].cartProductQuantity;
    };
    return count;
  };


  scrollToTrendingProducts() {
    const trendingSection = document.getElementById('trending-products-section');
    if (trendingSection) {
      trendingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
}



