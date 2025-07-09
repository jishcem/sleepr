import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '@app/common';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentsService
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map((res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findAndDelete({ _id });
  }
}
