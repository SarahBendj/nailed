import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('client' | 'owner')[]) => SetMetadata('roles', roles);
