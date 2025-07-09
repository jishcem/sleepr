import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Stripe from 'stripe';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc?: string;

  @IsNumber()
  exp_month?: number;

  @IsNumber()
  exp_year?: number;
  networks?: Stripe.PaymentMethodCreateParams.Card.Networks;

  @IsCreditCard()
  number?: string;

  token?: string;
}
