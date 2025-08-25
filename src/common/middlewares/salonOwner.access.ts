// import { BadRequestException, UnauthorizedException, HttpException} from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import jwtDecode from 'jwt-decode';

// export function salonOwnerAccessMiddleware(req: Request, _: Response, next: NextFunction) {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     throw new BadRequestException('Access token is required');
//   }

//   try {
  
//     const decoded: any = jwtDecode(token);

//     if (decoded.role !== 'client') {
//       throw new UnauthorizedException('Access denied. Only clients are allowed.');
//     }

//     if (decoded.consent === 'false') {
     
//       throw new HttpException('Consent required to access this resource', 450);
//     }


//     (req as any).user = decoded;

//     next();
//   } catch (err) {
//     throw new UnauthorizedException('Invalid or expired token');
//   }
// }

