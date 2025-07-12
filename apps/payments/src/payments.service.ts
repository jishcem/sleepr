import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') ?? '',
      {
        apiVersion: '2025-06-30.basil',
      },
    );
  }

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntend = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });

    this.notificationService.emit('notify_email', {
      email,
      subject: 'hello microservices',
      body: 'This is my body',
    });

    return paymentIntend;
  }
}
