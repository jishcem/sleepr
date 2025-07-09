import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') ?? '',
      {
        apiVersion: '2025-06-30.basil',
      },
    );
  }

  async createCharge({ amount }: CreateChargeDto) {
    const paymentIntend = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });

    return paymentIntend;
  }
}
