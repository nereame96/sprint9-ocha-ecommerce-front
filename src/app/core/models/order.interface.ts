import { PaymentMethod } from "../enums/payment-method.enum";
import { Status } from "../enums/status.enum";

export interface OrderModel {
    _id: string;
    userId: string;
    products: OrderProduct[];
    customTeas: OrderCustomTea[];
    totalAmount: number;
    totalItems: number;
    status: Status;
    paymentMethod: PaymentMethod;
    cardLast4?: string;
    isPaid: boolean; 
    paidAt: Date;
    deliveryAddress: DeliveryAddress;
    phone: string;
    createdAt: Date;
    updatedAt: Date;

}

export interface OrderProduct {
  productId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderCustomTea {
  customTeaId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}


export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
