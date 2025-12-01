import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SeedService } from './database/seed.service';
import { ProductoSeedService } from './productos/producto-seed.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.enableCors();

  // Serve uploaded files from /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  
  const seedService = app.get(SeedService);
  const productoSeedService = app.get(ProductoSeedService);
  
  try {
    await seedService.seed();
    await productoSeedService.seed();
  } catch (error) {
    console.error('Error en seed:', error);
  }
  
  await app.listen(3000);
  console.log('Aplicación ejecutándose en http://localhost:3000');
}
bootstrap();
