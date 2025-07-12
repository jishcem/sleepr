import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  private readonly transporter = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
  });

  async notifyEmail({ email, subject, body: text }: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: 'sleepr@gmail.com',
      to: email,
      subject,
      text,
      html: text,
    });
  }
}
