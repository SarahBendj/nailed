
import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    console.log('IP address:', req.ips.length ? req.ips[0] : req.ip);
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
