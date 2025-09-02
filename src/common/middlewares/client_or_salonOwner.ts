// import { ValidationPipe } from "@nestjs/common";
// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "src/app.module";
// import { clientAccessMiddleware } from "./client.access";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Validation globale
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));


//   app.use('/client', clientAccessMiddleware);


//   await app.listen(3000);
// }
