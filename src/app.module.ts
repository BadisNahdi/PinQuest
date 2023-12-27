import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      database: 'projet-web',
      username: 'root',
      password: '',
      // synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      // autoLoadEntities: true,
      port: 3306,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
