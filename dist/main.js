"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({
        origin: [
            'http://127.0.0.1:8080/',
            'http://localhost:4200',
            'https://cmsblog-frontend.azurewebsites.net',
        ],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CMS Blog')
        .setDescription('The blog API for professionals')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/', app, document);
    await app.listen(5000);
}
bootstrap().then();
//# sourceMappingURL=main.js.map