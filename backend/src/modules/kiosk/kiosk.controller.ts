import { Body, Controller, Post } from '@nestjs/common';
import { KioskService } from './kiosk.service.js';
import { VerifyDto } from './dto/verify.dto.js';
import { SubmitDto } from './dto/submit.dto.js';

@Controller('kiosk')
export class KioskController {
  constructor(private readonly kioskService: KioskService) {}

  @Post('verify')
  verify(@Body() dto: VerifyDto) {
    return this.kioskService.verify(dto);
  }

  @Post('submit')
  submit(@Body() dto: SubmitDto) {
    return this.kioskService.submit(dto);
  }
}