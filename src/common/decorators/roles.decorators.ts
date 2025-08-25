import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('client' | 'salon')[]) => SetMetadata('roles', roles);
